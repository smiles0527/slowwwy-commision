-- ============================================
-- Slowwwy CMS — About Page Sections Migration
-- Run this in the Supabase SQL Editor
-- (after running 002_commission_sections.sql)
-- ============================================

-- About page sections (structured content blocks)
create table public.about_sections (
  id uuid default gen_random_uuid() primary key,
  section_type text not null check (section_type in (
    'hero', 'bio', 'philosophy', 'discord', 'links'
  )),
  title text not null default '',
  content jsonb not null default '{}',
  display_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.about_sections enable row level security;

create policy "Public read about_sections" on public.about_sections
  for select using (true);

create policy "Auth insert about_sections" on public.about_sections
  for insert with check (auth.role() = 'authenticated');

create policy "Auth update about_sections" on public.about_sections
  for update using (auth.role() = 'authenticated');

create policy "Auth delete about_sections" on public.about_sections
  for delete using (auth.role() = 'authenticated');

-- Auto-update trigger
create trigger about_sections_updated_at
  before update on public.about_sections
  for each row execute function public.handle_updated_at();

-- Seed default about content
insert into public.about_sections (section_type, title, display_order, content) values
(
  'hero', 'About', 0,
  '{"subtitle": "The person behind the builds."}'
),
(
  'bio', 'Who I Am', 1,
  '{"text": "Hey — I''m the person behind Slowwwy. I got into custom keyboards a few years ago and quickly fell in love with the craft. What started as a hobby turned into a passion for building, tuning, and perfecting every detail. I believe every keyboard should feel as good as it looks.", "image_url": "", "image_alt": "Profile photo"}'
),
(
  'philosophy', 'Why Slowwwy?', 2,
  '{"text": "The name says it all. In a world that moves fast, I take my time. Every build is slow, intentional, and made with care. No rushing, no cutting corners — just honest craftsmanship.", "items": ["Attention to detail in every build", "Quality over quantity, always", "Open communication throughout the process", "A genuine love for the craft"]}'
),
(
  'discord', 'Find Me Online', 3,
  '{"discord_ids": [], "discord_invite": "", "note": "Come hang out, ask questions, or just talk keyboards."}'
),
(
  'links', 'Get in Touch', 4,
  '{"items": [{"label": "Instagram", "url": ""}, {"label": "Discord", "url": ""}, {"label": "Email", "url": ""}]}'
);
