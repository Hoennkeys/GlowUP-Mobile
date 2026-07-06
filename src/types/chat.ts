export type MessageStatus = 'sent' | 'delivered' | 'read';
export type PlatformType = 'whatsapp' | 'instagram' | 'telegram' | 'discord';

export interface Chat {
  id: string;
  userId: string;
  platform: PlatformType;
  contactName: string;
  contactAvatar?: string;
  externalChatId: string;
  lastMessage?: string;
  lastInteraction: string;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  isFromMe: boolean;
  createdAt: string;
  status: MessageStatus;
}
