-- Run this in Supabase SQL Editor once.

create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  price integer not null,
  description text not null,
  images jsonb not null default '[]'::jsonb,
  in_stock boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_updated_at_idx on public.products(updated_at desc);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id, content)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read product images'
  ) then
    create policy "Public can read product images"
    on storage.objects for select
    using (bucket_id = 'product-images');
  end if;
end $$;
