-- create table profiles (
--   id uuid primary key references auth.users(id) on delete cascade,
--   full_name text,
--   business_name text,
--   email text unique,
--   created_at timestamptz default now()
-- );

-- alter table profiles enable row level security;

-- create policy "Users can view their own profile"
--   on profiles for select
--   using (auth.uid() = id);

-- create policy "Users can insert their own profile"
--   on profiles for insert
--   with check (auth.uid() = id);

-- create policy "Users can update their own profile"
--   on profiles for update
--   using (auth.uid() = id);

  

  create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  email text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    business_name,
    email
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'business_name',
    new.email
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();