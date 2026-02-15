-- ============================================
-- Slowwwy CMS — Past Works Migration
-- Run this in the Supabase SQL Editor
-- (after running 003_about_sections.sql)
-- ============================================

-- Past works / portfolio items
create table public.past_works (
  id uuid default gen_random_uuid() primary key,
  title text not null default '',
  slug text not null default '',
  description text not null default '',
  cover_image text not null default '',
  images jsonb not null default '[]',
  specs jsonb not null default '{}',
  tags text[] not null default '{}',
  display_order int not null default 0,
  visible boolean not null default true,
  completed_at date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Unique slug constraint
create unique index past_works_slug_idx on public.past_works (slug);

-- RLS
alter table public.past_works enable row level security;

create policy "Public read past_works" on public.past_works
  for select using (true);

create policy "Auth insert past_works" on public.past_works
  for insert with check (auth.role() = 'authenticated');

create policy "Auth update past_works" on public.past_works
  for update using (auth.role() = 'authenticated');

create policy "Auth delete past_works" on public.past_works
  for delete using (auth.role() = 'authenticated');

-- Auto-update trigger
create trigger past_works_updated_at
  before update on public.past_works
  for each row execute function public.handle_updated_at();

-- Create storage bucket for past works images
insert into storage.buckets (id, name, public) values ('past-works', 'past-works', true)
on conflict (id) do nothing;

-- Storage policies for past-works bucket
create policy "Public read past-works" on storage.objects
  for select using (bucket_id = 'past-works');

create policy "Auth upload past-works" on storage.objects
  for insert with check (bucket_id = 'past-works' and auth.role() = 'authenticated');

create policy "Auth update past-works" on storage.objects
  for update using (bucket_id = 'past-works' and auth.role() = 'authenticated');

create policy "Auth delete past-works" on storage.objects
  for delete using (bucket_id = 'past-works' and auth.role() = 'authenticated');

-- Seed a sample work (optional — delete or edit from admin)
insert into public.past_works (title, slug, description, cover_image, specs, tags, display_order, visible) values
(
  'Sample Build',
  'sample-build',
  'This is a sample past work entry. Edit or delete it from the admin panel and replace it with your real builds.',
  '',
  '{"keyboard": "—", "switches": "—", "keycaps": "—", "plate": "—", "mods": "—"}',
  ARRAY['sample'],
  0,
  false
);
