
  create table public.stores (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    slug text not null unique,
    description text,
    logo_url text,
    hero_title text,
    hero_description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create index stores_owner_id_idx on public.stores(owner_id);
  create index stores_slug_idx on public.stores(slug);

  alter table public.stores enable row level security;

  create policy "Users can view their own store"
    on public.stores
    for select
    using (auth.uid() = owner_id);

  create policy "Users can insert their own store"
    on public.stores
    for insert
    with check (auth.uid() = owner_id);

  create policy "Users can update their own store"
    on public.stores
    for update
    using (auth.uid() = owner_id);

  create policy "Users can delete their own store"
    on public.stores
    for delete
    using (auth.uid() = owner_id);

  create policy "Public can view stores"
    on public.stores
    for select
    using (true);
