-- ============================================================
-- BELOJA — INITIAL SCHEMA
-- Multi-tenant: each consultant is a tenant identified by slug.
-- RLS enabled on every table. auth.uid() = consultants.user_id.
-- All identifiers in English. UI copy stays in pt-BR via i18n.
-- ============================================================

create extension if not exists "citext";

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type brand_category as enum (
  'beauty',
  'housewares',
  'nutrition',
  'other'
);

create type order_status as enum (
  'new',
  'confirmed',
  'paid',
  'delivered',
  'cancelled'
);

-- ============================================================
-- TABLE: brands
-- Master list of resale brands. Curated by us (is_official = true)
-- or added organically by consultants/waitlist (is_official = false).
-- This makes the brand list a living dataset instead of a frozen enum.
-- ============================================================

create table public.brands (
  id uuid primary key default gen_random_uuid(),

  slug citext not null unique,
  name text not null,
  category brand_category not null default 'other',

  -- Whether this brand is curated by Beloja (shown by default in pickers)
  -- vs organically added (waiting for review/promotion).
  is_official boolean not null default false,

  -- How many times this brand was selected/added across the platform.
  -- Used to surface trending brands and promote organic ones.
  reference_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint brand_slug_format check (slug ~* '^[a-z0-9][a-z0-9-]{1,40}[a-z0-9]$')
);

create index brands_category_idx on public.brands(category);
create index brands_is_official_idx on public.brands(is_official) where is_official = true;

-- Seed the initial curated list.
insert into public.brands (slug, name, category, is_official) values
  ('natura',         'Natura',           'beauty',     true),
  ('avon',           'Avon',             'beauty',     true),
  ('boticario',      'O Boticário',      'beauty',     true),
  ('eudora',         'Eudora',           'beauty',     true),
  ('mary-kay',       'Mary Kay',         'beauty',     true),
  ('hinode',         'Hinode',           'beauty',     true),
  ('jequiti',        'Jequiti',          'beauty',     true),
  ('racco',          'Racco',            'beauty',     true),
  ('mahogany',       'Mahogany',         'beauty',     true),
  ('yes-cosmetics',  'Yes Cosmetics',    'beauty',     true),
  ('lbel',           'L''Bel',           'beauty',     true),
  ('esika',          'Ésika',            'beauty',     true),
  ('cyzone',         'Cyzone',           'beauty',     true),
  ('belcorp',        'Belcorp',          'beauty',     true),
  ('tupperware',     'Tupperware',       'housewares', true),
  ('polishop',       'Polishop',         'housewares', true),
  ('hermes',         'Hermes',           'housewares', true),
  ('herbalife',      'Herbalife',        'nutrition',  true),
  ('amway',          'Amway / Nutrilite','nutrition',  true),
  ('omnilife',       'Omnilife',         'nutrition',  true),
  ('yakult',         'Yakult',           'nutrition',  true);

-- ============================================================
-- TABLE: consultants
-- One consultant = one tenant. Linked 1:1 to auth.users.
-- ============================================================

create table public.consultants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,

  -- Public identity
  slug citext not null unique,
  name text not null,
  bio text,
  avatar_url text,

  -- Contact (phone is also a login key, mirrored in auth.users)
  phone text not null,
  email citext,
  instagram text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint slug_format check (slug ~* '^[a-z0-9][a-z0-9-]{2,30}[a-z0-9]$'),
  constraint phone_format check (phone ~ '^[0-9]{10,15}$')
);

create index consultants_slug_idx on public.consultants(slug);
create index consultants_user_id_idx on public.consultants(user_id);

create unique index consultants_phone_unique
  on public.consultants(phone)
  where phone is not null;

create unique index consultants_email_unique
  on public.consultants(lower(email::text))
  where email is not null;

-- ============================================================
-- TABLE: consultant_brands
-- Many-to-many between consultants and brands.
-- Replaces the previous enum array field.
-- ============================================================

create table public.consultant_brands (
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete restrict,

  created_at timestamptz not null default now(),

  primary key (consultant_id, brand_id)
);

create index consultant_brands_brand_id_idx on public.consultant_brands(brand_id);

-- ============================================================
-- TABLE: products
-- Each product belongs to a single consultant.
-- ============================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,

  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  photo_url text,

  -- Visibility and ordering
  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_consultant_id_idx on public.products(consultant_id);
create index products_brand_id_idx on public.products(brand_id);
create index products_active_idx on public.products(is_active) where is_active = true;

-- ============================================================
-- TABLE: orders
-- An order placed by an end customer in the consultant's public store.
-- The end customer is NOT a Supabase user; they are an anonymous lead.
-- ============================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references public.consultants(id) on delete cascade,

  -- Customer data (lead, not a user)
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  notes text,

  total_cents integer not null check (total_cents >= 0),
  status order_status not null default 'new',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_consultant_id_idx on public.orders(consultant_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);

-- ============================================================
-- TABLE: order_items
-- Items in each order. Snapshot of name and unit price at order time
-- (because the product may be edited or deleted later).
-- ============================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,

  -- Snapshot at order time
  name_snapshot text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),

  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

-- ============================================================
-- TABLE: waitlist_entries
-- Captures pre-launch sign-ups from the landing page.
-- Independent of consultants — these aren't users yet.
-- ============================================================

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  phone text not null,
  email citext not null,
  brand_id uuid references public.brands(id) on delete set null,

  -- If the user typed a brand that wasn't in the list, we still
  -- create a brand row (is_official = false) and reference it.
  -- This field stores the raw text just for audit purposes.
  brand_raw_input text,

  -- Tracking
  source text,
  user_agent text,
  ip_address inet,

  created_at timestamptz not null default now(),

  constraint waitlist_phone_format check (phone ~ '^[0-9]{10,15}$')
);

create index waitlist_entries_created_at_idx on public.waitlist_entries(created_at desc);
create index waitlist_entries_brand_id_idx on public.waitlist_entries(brand_id);
create unique index waitlist_entries_email_unique on public.waitlist_entries(lower(email::text));
create unique index waitlist_entries_phone_unique on public.waitlist_entries(phone);

-- ============================================================
-- TRIGGERS: keep updated_at fresh
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

create trigger brands_set_updated_at
  before update on public.brands
  for each row execute function public.set_updated_at();

create trigger consultants_set_updated_at
  before update on public.consultants
  for each row execute function public.set_updated_at();

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- TRIGGER: maintain brands.reference_count
-- Increment on insert into consultant_brands or waitlist_entries,
-- decrement on delete.
-- ============================================================

create or replace function public.bump_brand_reference_count()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    if (new.brand_id is not null) then
      update public.brands set reference_count = reference_count + 1 where id = new.brand_id;
    end if;
    return new;
  elsif (tg_op = 'DELETE') then
    if (old.brand_id is not null) then
      update public.brands set reference_count = greatest(reference_count - 1, 0) where id = old.brand_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

create trigger consultant_brands_count_insert
  after insert on public.consultant_brands
  for each row execute function public.bump_brand_reference_count();

create trigger consultant_brands_count_delete
  after delete on public.consultant_brands
  for each row execute function public.bump_brand_reference_count();

create trigger waitlist_entries_count_insert
  after insert on public.waitlist_entries
  for each row execute function public.bump_brand_reference_count();

create trigger waitlist_entries_count_delete
  after delete on public.waitlist_entries
  for each row execute function public.bump_brand_reference_count();

-- ============================================================
-- HELPER: ownership check
-- ============================================================

create or replace function public.is_consultant_owner(consultant_uuid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.consultants
    where id = consultant_uuid
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- RPC: email lookup from phone (used for phone login)
-- ============================================================

create or replace function public.email_by_phone(p_phone text)
returns text
language sql
security definer
stable
as $$
  select email::text
  from public.consultants
  where phone = regexp_replace(p_phone, '[^0-9]', '', 'g')
  limit 1;
$$;

grant execute on function public.email_by_phone(text) to anon, authenticated;

-- ============================================================
-- RPC: validate slug availability (system reserved slugs blocked)
-- ============================================================

create or replace function public.is_slug_available(p_slug text)
returns boolean
language sql
security definer
stable
as $$
  select
    p_slug not in (
      'app','api','auth','blog','about','contact','terms','privacy',
      'admin','dashboard','signin','signup','login','register',
      '_next','static','assets','public','sobre','contato','termos',
      'privacidade','entrar','registrar'
    )
    and not exists (
      select 1 from public.consultants where slug = p_slug
    );
$$;

grant execute on function public.is_slug_available(text) to anon, authenticated;

-- ============================================================
-- RPC: find or create a brand by name (used by the waitlist combobox
-- when the user types a custom brand). Returns the brand id.
-- ============================================================

create or replace function public.find_or_create_brand(p_name text)
returns uuid
language plpgsql
security definer
volatile
as $$
declare
  v_slug text;
  v_brand_id uuid;
begin
  -- Normalize: lowercase, replace non-alphanumerics with hyphens, trim hyphens
  v_slug := lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-+|-+$', '', 'g');

  if v_slug = '' or length(v_slug) < 2 then
    raise exception 'Invalid brand name';
  end if;

  -- Try to find an existing brand by slug
  select id into v_brand_id from public.brands where slug = v_slug limit 1;

  if v_brand_id is not null then
    return v_brand_id;
  end if;

  -- Create a new organic brand
  insert into public.brands (slug, name, category, is_official)
  values (v_slug, trim(p_name), 'other', false)
  returning id into v_brand_id;

  return v_brand_id;
end;
$$;

grant execute on function public.find_or_create_brand(text) to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.brands             enable row level security;
alter table public.consultants        enable row level security;
alter table public.consultant_brands  enable row level security;
alter table public.products           enable row level security;
alter table public.orders             enable row level security;
alter table public.order_items        enable row level security;
alter table public.waitlist_entries   enable row level security;

-- ----- brands -----
-- Anyone can read brands (used in pickers across public surfaces)
create policy "brands: public read"
  on public.brands for select
  using (true);

-- Inserts go through find_or_create_brand RPC (security definer), so no policy needed.
-- No public update/delete.

-- ----- consultants -----
create policy "consultants: public read"
  on public.consultants for select
  using (true);

create policy "consultants: own insert"
  on public.consultants for insert
  with check (auth.uid() = user_id);

create policy "consultants: own update"
  on public.consultants for update
  using (auth.uid() = user_id);

create policy "consultants: own delete"
  on public.consultants for delete
  using (auth.uid() = user_id);

-- ----- consultant_brands -----
create policy "consultant_brands: public read"
  on public.consultant_brands for select
  using (true);

create policy "consultant_brands: owner insert"
  on public.consultant_brands for insert
  with check (public.is_consultant_owner(consultant_id));

create policy "consultant_brands: owner delete"
  on public.consultant_brands for delete
  using (public.is_consultant_owner(consultant_id));

-- ----- products -----
create policy "products: read active or owned"
  on public.products for select
  using (is_active = true or public.is_consultant_owner(consultant_id));

create policy "products: owner insert"
  on public.products for insert
  with check (public.is_consultant_owner(consultant_id));

create policy "products: owner update"
  on public.products for update
  using (public.is_consultant_owner(consultant_id));

create policy "products: owner delete"
  on public.products for delete
  using (public.is_consultant_owner(consultant_id));

-- ----- orders -----
create policy "orders: owner read"
  on public.orders for select
  using (public.is_consultant_owner(consultant_id));

create policy "orders: public insert"
  on public.orders for insert
  with check (true);

create policy "orders: owner update"
  on public.orders for update
  using (public.is_consultant_owner(consultant_id));

create policy "orders: owner delete"
  on public.orders for delete
  using (public.is_consultant_owner(consultant_id));

-- ----- order_items -----
create policy "order_items: owner read"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and public.is_consultant_owner(o.consultant_id)
    )
  );

create policy "order_items: public insert"
  on public.order_items for insert
  with check (true);

-- ----- waitlist_entries -----
-- Anyone can sign up; nobody (other than service_role) can read.
create policy "waitlist_entries: public insert"
  on public.waitlist_entries for insert
  with check (true);

-- No SELECT policy means RLS blocks reads from anon/authenticated.
-- Use the service_role key in server-side admin scripts to read.

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('avatars',  'avatars',  true)
on conflict (id) do nothing;

create policy "storage: public read products"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "storage: public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Path convention: {user_id}/{filename}
create policy "storage: own upload products"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: own upload avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: own delete products"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: own delete avatars"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );