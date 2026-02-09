-- ============================================
-- Slowwwy CMS — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Gallery items (keyboard photos)
create table public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  display_order int not null default 0,
  size text not null default 'medium' check (size in ('large', 'medium', 'small')),
  column_index int not null default 0 check (column_index between 0 and 2),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Site content (editable text fields)
create table public.site_content (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null default '',
  updated_at timestamptz default now() not null
);

-- 3. Seed default content
insert into public.site_content (key, value) values
  ('hero_meta', 'Keyboards'),
  ('hero_title', 'Slowwwy''s commission'),
  ('gallery_label', 'Gallery'),
  ('commission_label', 'Commissions'),
  ('commission_title', 'Coming soon'),
  ('commission_description', 'We''re preparing something special. Stay tuned.');

-- 4. Create storage bucket for gallery images
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- 5. Storage policies (allow public read, authenticated upload/delete)
create policy "Public read gallery" on storage.objects
  for select using (bucket_id = 'gallery');

create policy "Auth upload gallery" on storage.objects
  for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "Auth update gallery" on storage.objects
  for update using (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "Auth delete gallery" on storage.objects
  for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- 6. Row Level Security
alter table public.gallery_items enable row level security;
alter table public.site_content enable row level security;

-- Public can read everything
create policy "Public read gallery_items" on public.gallery_items
  for select using (true);

create policy "Public read site_content" on public.site_content
  for select using (true);

-- Only authenticated users can modify
create policy "Auth insert gallery_items" on public.gallery_items
  for insert with check (auth.role() = 'authenticated');

create policy "Auth update gallery_items" on public.gallery_items
  for update using (auth.role() = 'authenticated');

create policy "Auth delete gallery_items" on public.gallery_items
  for delete using (auth.role() = 'authenticated');

create policy "Auth update site_content" on public.site_content
  for update using (auth.role() = 'authenticated');

-- 7. Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function public.handle_updated_at();

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.handle_updated_at();
