-- ============================================================
-- CV MUDAMAS MANDIRI - ADMIN AUTH FOUNDATION
-- Jalankan sekali di Supabase SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('owner','admin','finance','project_manager','viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role, is_active)
  values (
    new.id,
    lower(split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', lower(split_part(coalesce(new.email, ''), '@', 1))),
    coalesce(new.raw_user_meta_data->>'role', 'admin'),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_admin_created on auth.users;
create trigger on_auth_admin_created
after insert on auth.users
for each row execute procedure public.handle_new_admin_user();

alter table public.profiles enable row level security;

create policy "admin can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "admin can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Helper used by future project/finance RLS policies.
create or replace function public.current_admin_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
  );
$$;

grant execute on function public.current_admin_is_active() to authenticated;
