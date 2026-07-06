-- ─────────────────────────────────────────────────────────────────────────────
-- GlowUP Mobile — profiles table + RLS + auto-create trigger
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Tabela profiles
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text,
  avatar_url  text,
  bio         text,
  updated_at  timestamptz default now()
);

-- 2. Row Level Security (nenhum dado vaza entre usuários)
alter table public.profiles enable row level security;

create policy "Usuário lê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário insere o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Trigger: cria perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Remove o trigger antigo se existir, depois recria
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
