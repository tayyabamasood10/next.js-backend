
  create table public.orders (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references public.stores(id) on delete cascade,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    total_amount numeric not null check (total_amount >= 0),
    status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at timestamptz default now()
  );

  create table public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id),
    product_name text not null,
    price numeric not null check (price >= 0),
    quantity integer not null check (quantity > 0),
    subtotal numeric not null check (subtotal >= 0)
  );

  create index orders_store_id_idx on public.orders(store_id);
  create index order_items_order_id_idx on public.order_items(order_id);

  alter table public.orders enable row level security;
  alter table public.order_items enable row level security;

  create policy "Store owners can view their orders"
    on public.orders
    for select
    using (exists (select 1 from public.stores where stores.id = orders.store_id and stores.owner_id = auth.uid()));

  create policy "Public can create orders"
    on public.orders
    for insert
    with check (true);

  create policy "Store owners can update their orders"
    on public.orders
    for update
    using (exists (select 1 from public.stores where stores.id = orders.store_id and stores.owner_id = auth.uid()));

  create policy "Store owners can view their order items"
    on public.order_items
    for select
    using (exists (select 1 from public.orders join public.stores on stores.id = orders.store_id where orders.id = order_items.order_id and stores.owner_id = auth.uid()));

  create policy "Public can create order items"
    on public.order_items
    for insert
    with check (true);

  create or replace function public.create_order(
    p_store_id uuid,
    p_customer_name text,
    p_customer_email text,
    p_customer_phone text,
    p_total_amount numeric,
    p_items jsonb
  )
  returns uuid
  language plpgsql
  security definer
  set search_path = public
  as $$
  declare
    v_order_id uuid;
  begin
    insert into public.orders (store_id, customer_name, customer_email, customer_phone, total_amount)
    values (p_store_id, p_customer_name, p_customer_email, p_customer_phone, p_total_amount)
    returning id into v_order_id;

    insert into public.order_items (order_id, product_id, product_name, price, quantity, subtotal)
    select v_order_id, (item->>'product_id')::uuid, item->>'product_name', (item->>'price')::numeric, (item->>'quantity')::integer, (item->>'subtotal')::numeric
    from jsonb_array_elements(p_items) as item;

    return v_order_id;
  end;
  $$;

  grant execute on function public.create_order(uuid, text, text, text, numeric, jsonb) to anon, authenticated;
