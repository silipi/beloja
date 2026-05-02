-- ============================================================
-- BELOJA - INITIAL SCHEMA
-- Multi-tenant: each consultant is a tenant identified by slug.
-- RLS enabled on every table. auth.uid() = consultora.user_id.
-- ============================================================

-- Useful extensions
create extension if not exists "citext";

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type marca_revenda as enum (
  'natura',
  'avon',
  'hinode',
  'jequiti',
  'boticario',
  'mary_kay',
  'eudora',
  'racco',
  'outra'
);

create type pedido_status as enum (
  'novo',
  'confirmado',
  'pago',
  'entregue',
  'cancelado'
);

-- ============================================================
-- TABLE: consultoras
-- One consultant = one tenant. Linked 1:1 to auth.users.
-- ============================================================

create table public.consultoras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,

  -- public identity
  slug citext not null unique,
  nome text not null,
  bio text,
  foto_url text,

  -- contact
  whatsapp text not null,
  instagram text,

  -- brands the consultant resells
  marcas marca_revenda[] not null default '{}',

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint slug_format check (slug ~* '^[a-z0-9][a-z0-9-]{2,30}[a-z0-9]$'),
  constraint whatsapp_format check (whatsapp ~ '^[0-9+]{10,15}$')
);

create index consultoras_slug_idx on public.consultoras(slug);
create index consultoras_user_id_idx on public.consultoras(user_id);

-- ============================================================
-- TABLE: produtos
-- Each product belongs to a consultant.
-- ============================================================

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  consultora_id uuid not null references public.consultoras(id) on delete cascade,

  nome text not null,
  descricao text,
  marca marca_revenda,
  preco_centavos integer not null check (preco_centavos >= 0),
  foto_url text,

  -- ordering and visibility
  ativo boolean not null default true,
  posicao integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index produtos_consultora_id_idx on public.produtos(consultora_id);
create index produtos_ativo_idx on public.produtos(ativo) where ativo = true;

-- ============================================================
-- TABLE: pedidos
-- Order placed by an end customer in the consultant's public store.
-- The end customer is NOT a Supabase user; they are an anonymous lead.
-- ============================================================

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  consultora_id uuid not null references public.consultoras(id) on delete cascade,

  -- customer data (not a user, just a lead)
  cliente_nome text not null,
  cliente_whatsapp text not null,
  cliente_endereco text,
  observacoes text,

  -- amounts
  total_centavos integer not null check (total_centavos >= 0),
  status pedido_status not null default 'novo',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pedidos_consultora_id_idx on public.pedidos(consultora_id);
create index pedidos_status_idx on public.pedidos(status);
create index pedidos_created_at_idx on public.pedidos(created_at desc);

-- ============================================================
-- TABLE: pedido_items
-- Items in each order. Snapshot of name and price (not a strong FK
-- to product, because the product may be edited/deleted later).
-- ============================================================

create table public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  produto_id uuid references public.produtos(id) on delete set null,

  -- snapshot at order time
  nome_snapshot text not null,
  preco_unitario_centavos integer not null check (preco_unitario_centavos >= 0),
  quantidade integer not null check (quantidade > 0),

  created_at timestamptz not null default now()
);

create index pedido_items_pedido_id_idx on public.pedido_items(pedido_id);

-- ============================================================
-- TRIGGER: update updated_at automatically
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger consultoras_set_updated_at
  before update on public.consultoras
  for each row execute function public.set_updated_at();

create trigger produtos_set_updated_at
  before update on public.produtos
  for each row execute function public.set_updated_at();

create trigger pedidos_set_updated_at
  before update on public.pedidos
  for each row execute function public.set_updated_at();

-- ============================================================
-- HELPER: check whether auth.uid() owns the consultant
-- ============================================================

create or replace function public.is_consultora_owner(consultora_uuid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.consultoras
    where id = consultora_uuid
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.consultoras enable row level security;
alter table public.produtos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;

-- ----- consultoras -----

-- Anyone can read public consultant data (the store is public)
create policy "consultoras: read público"
  on public.consultoras for select
  using (true);

-- Only the owner can insert their own consultant profile
create policy "consultoras: insert próprio"
  on public.consultoras for insert
  with check (auth.uid() = user_id);

-- Only the owner can update
create policy "consultoras: update próprio"
  on public.consultoras for update
  using (auth.uid() = user_id);

-- Only the owner can delete
create policy "consultoras: delete próprio"
  on public.consultoras for delete
  using (auth.uid() = user_id);

-- ----- produtos -----

-- Anyone can read active products; the owner sees all products, including inactive ones
create policy "produtos: read produtos ativos"
  on public.produtos for select
  using (ativo = true or public.is_consultora_owner(consultora_id));

-- Only the consultant owner can manage products
create policy "produtos: insert dono"
  on public.produtos for insert
  with check (public.is_consultora_owner(consultora_id));

create policy "produtos: update dono"
  on public.produtos for update
  using (public.is_consultora_owner(consultora_id));

create policy "produtos: delete dono"
  on public.produtos for delete
  using (public.is_consultora_owner(consultora_id));

-- ----- pedidos -----

-- Only the consultant owner can read orders
create policy "pedidos: read dono"
  on public.pedidos for select
  using (public.is_consultora_owner(consultora_id));

-- Anyone can create an order (end customers order without logging in)
create policy "pedidos: insert público"
  on public.pedidos for insert
  with check (true);

-- Only the owner can update the order status
create policy "pedidos: update dono"
  on public.pedidos for update
  using (public.is_consultora_owner(consultora_id));

-- Only the owner can delete
create policy "pedidos: delete dono"
  on public.pedidos for delete
  using (public.is_consultora_owner(consultora_id));

-- ----- pedido_items -----

create policy "pedido_items: read dono"
  on public.pedido_items for select
  using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and public.is_consultora_owner(p.consultora_id)
    )
  );

create policy "pedido_items: insert público"
  on public.pedido_items for insert
  with check (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('produtos', 'produtos', true),
  ('avatares', 'avatares', true)
on conflict (id) do nothing;

-- Policy: anyone can read (public bucket)
create policy "storage: read público produtos"
  on storage.objects for select
  using (bucket_id = 'produtos');

create policy "storage: read público avatares"
  on storage.objects for select
  using (bucket_id = 'avatares');

-- Policy: only authenticated users can upload to their own folders
-- Path convention: {user_id}/{filename}
create policy "storage: upload próprio produtos"
  on storage.objects for insert
  with check (
    bucket_id = 'produtos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: upload próprio avatares"
  on storage.objects for insert
  with check (
    bucket_id = 'avatares'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: delete próprio produtos"
  on storage.objects for delete
  using (
    bucket_id = 'produtos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: delete próprio avatares"
  on storage.objects for delete
  using (
    bucket_id = 'avatares'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
