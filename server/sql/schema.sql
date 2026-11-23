-- Run in your Supabase project's SQL Editor. Only the Express backend uses the service role key.
-- For safety there are no client-readable RLS policies. Never expose the service role key in a browser.
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  category text not null check (category in ('rackets', 'shoes', 'bags', 'accessories')),
  category_label text,
  brand text not null,
  name text not null,
  subtitle text not null,
  accent text,
  tone text,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
-- Do not add broad public policies: all reads and writes go through your own Express REST API.
create index if not exists products_category_idx on public.products(category);
