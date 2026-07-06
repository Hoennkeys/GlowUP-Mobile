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
