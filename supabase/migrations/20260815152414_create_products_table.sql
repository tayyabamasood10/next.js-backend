
  create table public.products (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    description text default '',
    price numeric not null check (price >= 0),
    stock integer not null default 0 check (stock >= 0),
    image_url text default '',
    status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create index products_store_id_idx on public.products(store_id);

  alter table public.products enable row level security;

  create policy "Users can view their own products"
    on public.products
    for select
    using (auth.uid() = store_id);

  create policy "Users can insert their own products"
    on public.products
    for insert
    with check (auth.uid() = store_id);

  create policy "Users can update their own products"
    on public.products
    for update
    using (auth.uid() = store_id);

  create policy "Users can delete their own products"
    on public.products
    for delete
    using (auth.uid() = store_id);

  create or replace function public.handle_updated_at()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
  as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$;

  create trigger products_set_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();
