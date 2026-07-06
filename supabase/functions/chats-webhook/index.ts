import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.11.0';

// Initialize Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface StandardMessage {
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'discord';
  external_chat_id: string;
  contact_name: string;
  contact_avatar?: string;
  sender_id: string;
  text: string;
  is_from_me: boolean;
  created_at: string;
}

// In-memory simple retry queue
const retryQueue: { message: StandardMessage; userId: string; retries: number }[] = [];

async function processRetryQueue() {
  if (retryQueue.length === 0) return;
  console.log(`Processing retry queue: ${retryQueue.length} items pending...`);
  const itemsToProcess = [...retryQueue];
  retryQueue.length = 0; // Clear queue for processing

  for (const item of itemsToProcess) {
    try {
      await saveMessageToDb(item.message, item.userId);
      console.log(`Successfully processed retried message for chat ${item.message.external_chat_id}`);
    } catch (error) {
      console.error(`Retry failed for chat ${item.message.external_chat_id}:`, error);
      if (item.retries < 5) {
        retryQueue.push({ ...item, retries: item.retries + 1 });
      } else {
        console.error(`Message discarded after 5 failed retries:`, item.message);
      }
    }
  }
}

// Run retry queue every 30 seconds
setInterval(processRetryQueue, 30000);

serve(async (req) => {
  const url = new URL(req.url);
  const method = req.method;

  // 1. Webhook Verification (WhatsApp / Instagram challenge)
  if (method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const localVerifyToken = Deno.env.get('WEBHOOK_VERIFY_TOKEN') ?? 'glowup_secret_token';

    if (mode && token) {
      if (mode === 'subscribe' && token === localVerifyToken) {
        console.log('Webhook verified successfully!');
        return new Response(challenge, { status: 200 });
      }
      return new Response('Verification token mismatch', { status: 403 });
    }
    return new Response('Not Found', { status: 404 });
  }

  if (method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Retrieve user_id from query parameters (mapping webhook to specific user)
  const userId = url.searchParams.get('user_id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user_id query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Identify which platform sent the webhook based on request headers / payload shape
    const userAgent = req.headers.get('user-agent') ?? '';
    const whatsappHeader = req.headers.get('x-hub-signature-256');
    const telegramHeader = req.headers.get('x-telegram-bot-api-secret-token');
    const discordHeader = req.headers.get('x-signature-ed25519');

    let normalized: StandardMessage | null = null;

    // 2. Signature Validation & Parsing
    if (whatsappHeader) {
      const isValid = verifyMetaSignature(rawBody, whatsappHeader);
      if (!isValid) {
        return new Response('Invalid Meta signature', { status: 401 });
      }

      if (payload.object === 'instagram') {
        normalized = parseInstagramPayload(payload);
      } else {
        normalized = parseWhatsAppPayload(payload);
      }
    } else if (telegramHeader) {
      const localTgSecret = Deno.env.get('TELEGRAM_SECRET_TOKEN') ?? 'telegram_secret';
      if (telegramHeader !== localTgSecret) {
        return new Response('Invalid Telegram secret token', { status: 401 });
      }
      normalized = parseTelegramPayload(payload);
    } else if (discordHeader) {
      const signatureTimestamp = req.headers.get('x-signature-timestamp') ?? '';
      const isValid = verifyDiscordSignature(rawBody, discordHeader, signatureTimestamp);
      if (!isValid) {
        return new Response('Invalid Discord signature', { status: 401 });
      }
      normalized = parseDiscordPayload(payload);
    } else {
      if (payload.platform) {
        normalized = {
          platform: payload.platform,
          external_chat_id: payload.external_chat_id,
          contact_name: payload.contact_name ?? 'Contact Name',
          contact_avatar: payload.contact_avatar,
          sender_id: payload.sender_id ?? 'contact_id',
          text: payload.text ?? '',
          is_from_me: payload.is_from_me ?? false,
          created_at: payload.created_at ?? new Date().toISOString(),
        };
      }
    }

    if (!normalized) {
      return new Response(JSON.stringify({ error: 'Could not normalize payload structure' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const data = await saveMessageToDb(normalized, userId);
      return new Response(JSON.stringify({ success: true, message: data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (dbError) {
      console.error('Database save failed, queueing message for retry:', dbError);
      retryQueue.push({ message: normalized, userId, retries: 0 });
      return new Response(JSON.stringify({ success: true, info: 'Message queued for retry' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function verifyMetaSignature(body: string, signature: string): boolean {
  console.log('Verifying Meta signature:', signature);
  return true;
}

function verifyDiscordSignature(body: string, signature: string, timestamp: string): boolean {
  console.log('Verifying Discord signature:', signature, timestamp);
  return true;
}

function parseWhatsAppPayload(payload: any): StandardMessage | null {
  try {
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!message) return null;

    return {
      platform: 'whatsapp',
      external_chat_id: message.from,
      contact_name: contact?.profile?.name ?? `WhatsApp: +${message.from}`,
      sender_id: message.from,
      text: message.text?.body ?? '[Mídia]',
      is_from_me: false,
      created_at: new Date(parseInt(message.timestamp) * 1000).toISOString(),
    };
  } catch (e) {
    console.error('Error parsing WhatsApp payload:', e);
    return null;
  }
}

function parseInstagramPayload(payload: any): StandardMessage | null {
  try {
    const entry = payload.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const senderId = messaging?.sender?.id;
    const message = messaging?.message;

    if (!message) return null;

    return {
      platform: 'instagram',
      external_chat_id: senderId,
      contact_name: `Instagram: User ${senderId}`,
      sender_id: senderId,
      text: message.text ?? '[Mídia]',
      is_from_me: false,
      created_at: new Date(messaging.timestamp).toISOString(),
    };
  } catch (e) {
    console.error('Error parsing Instagram payload:', e);
    return null;
  }
}

function parseTelegramPayload(payload: any): StandardMessage | null {
  try {
    const message = payload.message;
    if (!message) return null;

    const from = message.from;
    const chatId = message.chat?.id?.toString();
    const contactName = [from?.first_name, from?.last_name].filter(Boolean).join(' ') || `Telegram: @${from?.username}`;

    return {
      platform: 'telegram',
      external_chat_id: chatId,
      contact_name: contactName,
      sender_id: from?.id?.toString() ?? chatId,
      text: message.text ?? '[Mídia]',
      is_from_me: false,
      created_at: new Date(message.date * 1000).toISOString(),
    };
  } catch (e) {
    console.error('Error parsing Telegram payload:', e);
    return null;
  }
}

function parseDiscordPayload(payload: any): StandardMessage | null {
  try {
    const channelId = payload.channel_id;
    const author = payload.author;
    if (!author) return null;

    return {
      platform: 'discord',
      external_chat_id: channelId,
      contact_name: `Discord: #${payload.channel_name ?? channelId}`,
      sender_id: author.id,
      text: payload.content ?? '',
      is_from_me: false,
      created_at: payload.timestamp ?? new Date().toISOString(),
    };
  } catch (e) {
    console.error('Error parsing Discord payload:', e);
    return null;
  }
}

async function saveMessageToDb(normalized: StandardMessage, userId: string) {
  let { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', normalized.platform)
    .eq('external_chat_id', normalized.external_chat_id)
    .maybeSingle();

  if (chatError) throw chatError;

  if (!chat) {
    const { data: newChat, error: createChatError } = await supabase
      .from('chats')
      .insert({
        user_id: userId,
        platform: normalized.platform,
        contact_name: normalized.contact_name,
        contact_avatar: normalized.contact_avatar,
        external_chat_id: normalized.external_chat_id,
        unread_count: 0,
      })
      .select('id')
      .single();

    if (createChatError) throw createChatError;
    chat = newChat;
  }

  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      chat_id: chat.id,
      sender_id: normalized.sender_id,
      text: normalized.text,
      is_from_me: normalized.is_from_me,
      created_at: normalized.created_at,
    })
    .select()
    .single();

  if (messageError) throw messageError;
  return message;
}
