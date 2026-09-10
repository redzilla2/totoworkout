-- TotoWorkouts cloud sync schema
-- Run this once in your Supabase project's SQL editor (Dashboard > SQL Editor > New query).

create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "Users can read own state"
  on public.app_state for select
  using (auth.uid() = user_id);

create policy "Users can insert own state"
  on public.app_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own state"
  on public.app_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep updated_at current on every write
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_state_set_updated_at on public.app_state;
create trigger app_state_set_updated_at
  before update on public.app_state
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Master Admin: a single admin-editable "master routines" catalog + admin-only
-- user list/delete. Everything a regular user does to their own routines
-- already stays isolated to their own app_state row via the RLS policies
-- above — this section is only for the separate admin page.
--
-- Change ADMIN_EMAIL below (and the matching constant in
-- src/components/AdminView.js / src/state.js) if the admin account ever
-- changes.
-- ---------------------------------------------------------------------------

-- One row holding the admin-curated routine catalog that brand-new signups
-- are seeded from (see fetchMasterRoutines() in state.js). Editing this
-- table never touches any existing user's already-saved routines — it's
-- only read once, at first sign-in on a new account.
create table if not exists public.master_routines (
  id text primary key default 'singleton',
  routines jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.master_routines enable row level security;

-- Any signed-in user can read it (needed for a brand-new account's own
-- first-sign-in bootstrap fetch) but only the admin account can write it.
create policy "Authenticated users can read master routines"
  on public.master_routines for select
  using (auth.role() = 'authenticated');

create policy "Only admin can write master routines"
  on public.master_routines for insert
  with check (auth.jwt() ->> 'email' = 'anthonybristol@gmail.com');

create policy "Only admin can update master routines"
  on public.master_routines for update
  using (auth.jwt() ->> 'email' = 'anthonybristol@gmail.com')
  with check (auth.jwt() ->> 'email' = 'anthonybristol@gmail.com');

drop trigger if exists master_routines_set_updated_at on public.master_routines;
create trigger master_routines_set_updated_at
  before update on public.master_routines
  for each row execute function public.set_updated_at();

-- Admin-only user list/delete. auth.users isn't exposed to the client
-- directly (by design — Supabase doesn't put the auth schema on the
-- PostgREST API), so these are SECURITY DEFINER functions that check the
-- caller's own JWT email server-side before touching anything. Being
-- SECURITY DEFINER only changes which role's table privileges apply inside
-- the function body — auth.jwt()/auth.uid() still reflect whoever actually
-- called it, so the check below can't be bypassed by calling the function
-- directly.
create or replace function public.admin_list_users()
returns table (id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'anthonybristol@gmail.com' then
    raise exception 'not authorized';
  end if;

  -- auth.users.email is varchar, not text — cast it explicitly, since
  -- Postgres requires an exact type match against the declared return
  -- type above (a varchar/text mismatch fails at call time with
  -- "structure of query does not match function result type").
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at
    from auth.users u
    order by u.created_at desc;
end;
$$;

grant execute on function public.admin_list_users() to authenticated;

-- Deleting from auth.users cascades to that user's app_state row (see the
-- "on delete cascade" on app_state.user_id above) and to Supabase's own
-- internal auth tables (identities/sessions/refresh tokens), which already
-- cascade off auth.users the same way auth.admin.deleteUser() relies on.
create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'anthonybristol@gmail.com' then
    raise exception 'not authorized';
  end if;

  select email into target_email from auth.users where id = target_user_id;
  if target_email is null then
    raise exception 'user not found';
  end if;
  if target_email = 'anthonybristol@gmail.com' then
    raise exception 'cannot delete the admin account';
  end if;

  delete from auth.users where id = target_user_id;
end;
$$;

grant execute on function public.admin_delete_user(uuid) to authenticated;
