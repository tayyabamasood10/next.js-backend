
  create table public.sale_invoices (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references public.profiles(id) on delete cascade,
    invoice_number text not null,
    customer_name text not null,
    customer_email text default '',
    customer_phone text default '',
    items jsonb not null default '[]',
    subtotal numeric not null default 0 check (subtotal >= 0),
    tax_rate numeric not null default 0 check (tax_rate >= 0 and tax_rate <= 100),
    tax_amount numeric not null default 0 check (tax_amount >= 0),
    discount_amount numeric not null default 0 check (discount_amount >= 0),
    total numeric not null default 0 check (total >= 0),
    status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    notes text default '',
    due_date date,
    paid_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create index sale_invoices_store_id_idx on public.sale_invoices(store_id);
  create index sale_invoices_status_idx on public.sale_invoices(status);
  create unique index sale_invoices_store_number_idx on public.sale_invoices(store_id, invoice_number);

  alter table public.sale_invoices enable row level security;

  create policy "Users can view their own sale invoices"
    on public.sale_invoices
    for select
    using (auth.uid() = store_id);

  create policy "Users can insert their own sale invoices"
    on public.sale_invoices
    for insert
    with check (auth.uid() = store_id);

  create policy "Users can update their own sale invoices"
    on public.sale_invoices
    for update
    using (auth.uid() = store_id);

  create policy "Users can delete their own sale invoices"
    on public.sale_invoices
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

  create trigger sale_invoices_set_updated_at
    before update on public.sale_invoices
    for each row
    execute function public.handle_updated_at();
