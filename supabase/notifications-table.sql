-- Create a dedicated notifications table for the Supabase Realtime feed.
-- Run this via the Supabase SQL editor or `supabase db query`.

create table if not exists public.notifications (
  id uuid generated always as identity primary key,
  employee_id uuid references auth.users (id) on delete cascade,
  title text not null,
  detail text,
  metadata jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'User-facing alerts that drive the in-app bell and realtime channel.';

alter table public.notifications enable row level security;

create policy "Users can see their notifications" on public.notifications
  for select using (employee_id = auth.uid());

create policy "Users can insert notifications for themselves" on public.notifications
  for insert with check (employee_id = auth.uid());
