-- ─────────────────────────────────────────────────────────────────────────────
-- GlowUP Mobile — avatars storage bucket + RLS policies
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create public bucket for user avatars
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,           -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- 2. Allow authenticated users to upload into their own folder (userId/filename)
create policy "Usuário faz upload do próprio avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Allow public read (avatars are public URLs)
create policy "Leitura pública dos avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- 4. Allow users to update their own avatar files
create policy "Usuário atualiza o próprio avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Allow users to delete their own avatar files
create policy "Usuário deleta o próprio avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
