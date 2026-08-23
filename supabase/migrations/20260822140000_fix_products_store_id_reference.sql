
  alter table public.products drop constraint if exists products_store_id_fkey;

  update public.products
  set store_id = stores.id
  from public.stores
  where stores.owner_id = products.store_id;

  alter table public.products add constraint products_store_id_fkey foreign key (store_id) references public.stores(id) on delete cascade;

  drop policy if exists "Users can view their own products" on public.products;
  drop policy if exists "Users can insert their own products" on public.products;
  drop policy if exists "Users can update their own products" on public.products;
  drop policy if exists "Users can delete their own products" on public.products;

  create policy "Users can view their own products"
    on public.products
    for select
    using (exists (select 1 from public.stores where stores.id = products.store_id and stores.owner_id = auth.uid()));

  create policy "Users can insert their own products"
    on public.products
    for insert
    with check (exists (select 1 from public.stores where stores.id = products.store_id and stores.owner_id = auth.uid()));

  create policy "Users can update their own products"
    on public.products
    for update
    using (exists (select 1 from public.stores where stores.id = products.store_id and stores.owner_id = auth.uid()));

  create policy "Users can delete their own products"
    on public.products
    for delete
    using (exists (select 1 from public.stores where stores.id = products.store_id and stores.owner_id = auth.uid()));

  create policy "Public can view active products"
    on public.products
    for select
    using (status = 'active');
