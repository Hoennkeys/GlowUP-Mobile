import { supabase } from './supabase';
import type { UpdateProfilePayload } from '../types/auth';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/* eslint-disable no-bitwise, no-div-regex */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  
  // Remove padding and whitespace
  const cleanBase64 = base64.replace(/=+$/, '').replace(/\s/g, '');
  const len = cleanBase64.length;
  const bufferLength = Math.floor((len * 3) / 4);
  const bytes = new Uint8Array(bufferLength);
  
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const encoded1 = lookup[cleanBase64.charCodeAt(i)];
    const encoded2 = lookup[cleanBase64.charCodeAt(i + 1)];
    const encoded3 = i + 2 < len ? lookup[cleanBase64.charCodeAt(i + 2)] : 0;
    const encoded4 = i + 3 < len ? lookup[cleanBase64.charCodeAt(i + 3)] : 0;
    
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    if (p < bufferLength) {
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    if (p < bufferLength) {
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  }
  return bytes.buffer;
}
/* eslint-enable no-bitwise, no-div-regex */

export async function uploadAvatar(userId: string, base64: string, localUri: string): Promise<string> {
  const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const arrayBuffer = base64ToArrayBuffer(base64);

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, { contentType: mimeType, upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function updateProfile(userId: string, payload: UpdateProfilePayload) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: payload.name,
      avatar_url: payload.avatarUrl,
      bio: payload.bio,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;

  const { error: metaError } = await supabase.auth.updateUser({
    data: { name: payload.name, avatar_url: payload.avatarUrl },
  });
  if (metaError) throw metaError;

  return data;
}
