-- ─────────────────────────────────────────────────────────────────────────────
-- GlowUP Mobile — Chats and Messages tables + RLS + trigger updates
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create platform_enum type if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_enum') THEN
    CREATE TYPE platform_enum AS ENUM ('whatsapp', 'instagram', 'telegram', 'discord');
  END IF;
END$$;

-- 2. Create message_status enum if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
    CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
  END IF;
END$$;

-- 3. Create chats table
create table if not exists public.chats (
  id                  uuid          primary key default gen_random_uuid(),
  user_id             uuid          not null references public.profiles(id) on delete cascade,
  platform            platform_enum not null,
  contact_name        text          not null,
  contact_avatar      text,
  external_chat_id    text          not null,
  last_message        text,
  last_interaction    timestamptz   default now(),
  unread_count        integer       default 0,
  created_at          timestamptz   default now(),
  unique(user_id, platform, external_chat_id)
);

-- Enable RLS for chats
alter table public.chats enable row level security;

-- Policies for chats
create policy "Users can view their own chats"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "Users can update their own chats"
  on public.chats for update
  using (auth.uid() = user_id);

create policy "Users can insert their own chats"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own chats"
  on public.chats for delete
  using (auth.uid() = user_id);

-- 4. Create messages table
create table if not exists public.messages (
  id                  uuid          primary key default gen_random_uuid(),
  chat_id             uuid          not null references public.chats(id) on delete cascade,
  sender_id           text          not null,
  text                text          not null,
  is_from_me          boolean       default false,
  created_at          timestamptz   default now(),
  status              message_status default 'sent'
);

-- Enable RLS for messages
alter table public.messages enable row level security;

-- Policies for messages
create policy "Users can view messages in their chats"
  on public.messages for select
  using (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

create policy "Users can insert messages in their chats"
  on public.messages for insert
  with check (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

create policy "Users can update messages in their chats"
  on public.messages for update
  using (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

-- 5. Create indexes for performance
create index if not exists idx_chats_user_id on public.chats(user_id);
create index if not exists idx_chats_last_interaction on public.chats(last_interaction desc);
create index if not exists idx_messages_chat_id on public.messages(chat_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- 6. Trigger: update last_message, last_interaction, and increment unread_count automatically
create or replace function public.update_chat_on_new_message()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.chats
  set 
    last_message = new.text,
    last_interaction = new.created_at,
    unread_count = case 
      when new.is_from_me = false then unread_count + 1 
      else unread_count 
    end
  where id = new.chat_id;
  return new;
end;
$$;

drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row
  execute procedure public.update_chat_on_new_message();
