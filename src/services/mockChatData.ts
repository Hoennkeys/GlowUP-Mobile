import { supabase } from './supabase';

const MOCK_CONTACTS = {
  whatsapp: {
    contact_name: 'Ana Silva (WhatsApp)',
    external_chat_id: '5511999999999',
    contact_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    messages: [
      'Olá! Gostaria de saber mais sobre a campanha da GlowUP.',
      'Você tem os detalhes de engajamento?',
      'Aguardo seu retorno!'
    ]
  },
  instagram: {
    contact_name: 'Felipe Rossi (Instagram)',
    external_chat_id: 'felipe_rossi',
    contact_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    messages: [
      'Gostei do seu story! Vamos fechar uma parceria?',
      'Te enviei os termos por e-mail também.',
      'Me avisa quando puder conversar.'
    ]
  },
  telegram: {
    contact_name: 'Luiza Souza (Telegram)',
    external_chat_id: '987654321',
    contact_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    messages: [
      'Oi, o grupo da campanha já foi criado?',
      'Qual o link de acesso?'
    ]
  },
  discord: {
    contact_name: 'Pedro Costa (Discord)',
    external_chat_id: '432109876543',
    contact_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    messages: [
      'E aí, tudo pronto para a call de alinhamento no servidor?',
      'O canal #campanha-glowup está liberado.'
    ]
  }
};

export async function populateMockChats(userId: string): Promise<void> {
  console.log('Populating mock chats for user:', userId);
  
  for (const [platform, contact] of Object.entries(MOCK_CONTACTS)) {
    let { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('external_chat_id', contact.external_chat_id)
      .maybeSingle();

    if (chatError) {
      console.error(`Error querying chat for ${platform}:`, chatError);
      continue;
    }

    if (!chat) {
      const { data: newChat, error: createChatError } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          platform: platform as any,
          contact_name: contact.contact_name,
          contact_avatar: contact.contact_avatar,
          external_chat_id: contact.external_chat_id,
          unread_count: contact.messages.length,
        })
        .select('id')
        .single();

      if (createChatError) {
        console.error(`Error creating mock chat for ${platform}:`, createChatError);
        continue;
      }
      chat = newChat;
    }

    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id);

    if (countError) continue;

    if (count === 0) {
      for (let i = 0; i < contact.messages.length; i++) {
        const text = contact.messages[i];
        const time = new Date();
        time.setMinutes(time.getMinutes() - (contact.messages.length - i) * 10);

        await supabase.from('messages').insert({
          chat_id: chat.id,
          sender_id: contact.external_chat_id,
          text: text,
          is_from_me: false,
          created_at: time.toISOString(),
          status: 'delivered',
        });
      }
    }
  }
}

export async function simulateIncomingMessage(
  userId: string,
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'discord'
): Promise<any> {
  const contact = MOCK_CONTACTS[platform];
  if (!contact) return null;

  const { data: chat } = await supabase
    .from('chats')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', platform)
    .eq('external_chat_id', contact.external_chat_id)
    .single();

  if (!chat) {
    throw new Error(`Chat for platform ${platform} not found. Run populate first.`);
  }

  const phrases = [
    'Oi! Só queria confirmar se deu tudo certo.',
    'Excelente, aguardo a publicação.',
    'Temos novidades sobre o briefing da campanha.',
    'Pode conferir as diretrizes no painel?',
    'Estou online agora se quiser conversar.',
  ];
  const randomText = phrases[Math.floor(Math.random() * phrases.length)];

  const { data: msg, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chat.id,
      sender_id: contact.external_chat_id,
      text: randomText,
      is_from_me: false,
      status: 'delivered',
    })
    .select()
    .single();

  if (error) throw error;
  return msg;
}
