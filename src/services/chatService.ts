import { supabase } from './supabase';
import type { Chat, Message } from '../types';

function mapDbChat(dbChat: any): Chat {
  return {
    id: dbChat.id,
    userId: dbChat.user_id,
    platform: dbChat.platform,
    contactName: dbChat.contact_name,
    contactAvatar: dbChat.contact_avatar || undefined,
    externalChatId: dbChat.external_chat_id,
    lastMessage: dbChat.last_message || undefined,
    lastInteraction: dbChat.last_interaction,
    unreadCount: dbChat.unread_count ?? 0,
    createdAt: dbChat.created_at,
  };
}

function mapDbMessage(dbMsg: any): Message {
  return {
    id: dbMsg.id,
    chatId: dbMsg.chat_id,
    senderId: dbMsg.sender_id,
    text: dbMsg.text,
    isFromMe: dbMsg.is_from_me,
    createdAt: dbMsg.created_at,
    status: dbMsg.status,
  };
}

export async function getChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('last_interaction', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDbChat);
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapDbMessage);
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      text: text,
      is_from_me: true,
      status: 'sent',
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbMessage(data);
}

export async function markChatAsRead(chatId: string): Promise<void> {
  const { error: chatError } = await supabase
    .from('chats')
    .update({ unread_count: 0 })
    .eq('id', chatId);

  if (chatError) {
    console.error('Error marking chat as read:', chatError);
  }

  const { error: msgError } = await supabase
    .from('messages')
    .update({ status: 'read' })
    .eq('chat_id', chatId)
    .eq('is_from_me', false);

  if (msgError) {
    console.error('Error updating messages status to read:', msgError);
  }
}

export function subscribeToChats(userId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`chats_realtime_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToMessages(
  chatId: string,
  onInsert: (message: Message) => void,
  onUpdate?: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages_realtime_${chatId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          onInsert(mapDbMessage(payload.new));
        } else if (payload.eventType === 'UPDATE' && onUpdate) {
          onUpdate(mapDbMessage(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
