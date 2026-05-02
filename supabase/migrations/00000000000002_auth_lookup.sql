-- ============================================================
-- ADJUSTMENT: phone as login key + mirrored email
-- ============================================================

-- 1) Rename whatsapp to telefone if needed
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'consultoras'
      and column_name = 'whatsapp'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'consultoras'
      and column_name = 'telefone'
  ) then
    alter table public.consultoras rename column whatsapp to telefone;
  end if;
end $$;

-- 2) Mirrored email from auth.users
alter table public.consultoras
  add column if not exists email citext;

-- 3) Phone normalization and format
update public.consultoras
  set telefone = regexp_replace(telefone, '[^0-9]', '', 'g')
  where telefone is not null;

alter table public.consultoras drop constraint if exists whatsapp_format;
alter table public.consultoras drop constraint if exists telefone_format;
alter table public.consultoras
  add constraint telefone_format check (telefone ~ '^[0-9]{10,15}$');

-- 4) Partial unique indexes (lookup keys)
create unique index if not exists consultoras_telefone_unique
  on public.consultoras(telefone)
  where telefone is not null;

create unique index if not exists consultoras_email_unique
  on public.consultoras(lower(email::text))
  where email is not null;

-- 5) RPC: email lookup from phone (used for phone login)
create or replace function public.email_por_telefone(p_telefone text)
returns text
language sql
security definer
stable
as $$
  select email::text
  from public.consultoras
  where telefone = regexp_replace(p_telefone, '[^0-9]', '', 'g')
  limit 1;
$$;

grant execute on function public.email_por_telefone(text) to anon, authenticated;

-- 6) RPC: validate slug availability (includes system reserved slugs)
create or replace function public.slug_disponivel(p_slug text)
returns boolean
language sql
security definer
stable
as $$
  select
    p_slug not in (
      'app','api','auth','blog','sobre','contato','termos','privacidade',
      'admin','dashboard','entrar','registrar','login','signup',
      '_next','static','assets','public'
    )
    and not exists (
      select 1 from public.consultoras where slug = p_slug
    );
$$;

grant execute on function public.slug_disponivel(text) to anon, authenticated;
