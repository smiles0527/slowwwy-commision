-- ============================================
-- Slowwwy CMS — Commission Sections Migration
-- Run this in the Supabase SQL Editor
-- (after running the initial schema.sql)
-- ============================================

-- Commission sections (structured content blocks)
create table public.commission_sections (
  id uuid default gen_random_uuid() primary key,
  section_type text not null check (section_type in (
    'status', 'intro', 'services', 'pricing', 'steps', 'faq', 'links'
  )),
  title text not null default '',
  content jsonb not null default '{}',
  display_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.commission_sections enable row level security;

create policy "Public read commission_sections" on public.commission_sections
  for select using (true);

create policy "Auth insert commission_sections" on public.commission_sections
  for insert with check (auth.role() = 'authenticated');

create policy "Auth update commission_sections" on public.commission_sections
  for update using (auth.role() = 'authenticated');

create policy "Auth delete commission_sections" on public.commission_sections
  for delete using (auth.role() = 'authenticated');

-- Auto-update trigger
create trigger commission_sections_updated_at
  before update on public.commission_sections
  for each row execute function public.handle_updated_at();

-- Seed default commission content
insert into public.commission_sections (section_type, title, display_order, content) values
(
  'status', 'Build Service Status', 0,
  '{"status": "open", "note": "Currently accepting new commissions."}'
),
(
  'intro', 'About', 1,
  '{"text": "Slowwwy offers a premium keyboard build service. Every build is crafted with care, attention to detail, and a commitment to quality. Whether you already have your parts or need guidance, I am here to help bring your dream keyboard to life."}'
),
(
  'services', 'What I Can Do', 2,
  '{"items": ["Soldering (switches, through-hole components)", "Desoldering and rebuilds", "Case assembly and tuning", "Stabilizer lubing and tuning", "Switch modification (lubing, filming)", "PCB testing and basic programming", "Repair services (case-dependent)", "Other — feel free to ask"]}'
),
(
  'pricing', 'Pricing', 3,
  '{"note": "Pricing is based on time and labor. Prices do not include extra supplies, shipping, or fees.", "tiers": [{"label": "Macropads / Numpads", "price": "$50"}, {"label": "40%", "price": "$65"}, {"label": "60–65%", "price": "$80"}, {"label": "75%", "price": "$90"}, {"label": "TKL", "price": "$95"}, {"label": "Full-size / 1800", "price": "$105"}], "extras": [{"label": "Desoldering (add-on)", "price": "from $35"}, {"label": "Switch modding", "price": "~$1.25/switch"}, {"label": "Stabilizer kit", "price": "$18–26"}, {"label": "Lubricant", "price": "$8–13"}]}'
),
(
  'steps', 'How It Works', 4,
  '{"items": [{"step": 1, "title": "Gather Your Parts", "description": "Source your keyboard kit, stabilizers, switches, and any extras."}, {"step": 2, "title": "Get in Touch", "description": "Fill out the commission form below. I will review your request and confirm details."}, {"step": 3, "title": "Ship Your Parts", "description": "Ship everything to me. You cover shipping both ways."}, {"step": 4, "title": "Build & Deliver", "description": "Your keyboard is assembled with care. Once complete, I will ship it back or arrange pickup."}]}'
),
(
  'faq', 'FAQ', 5,
  '{"items": [{"question": "Can you source parts for me?", "answer": "I can help guide you on what to buy and where, but generally you will need to source your own parts."}, {"question": "How long does a build take?", "answer": "Typical turnaround is 2–3 weeks after all parts arrive. Rush requests may be accommodated — just ask."}, {"question": "Do you offer remote consultations?", "answer": "Yes — I am happy to help with parts selection, layout advice, or general keyboard questions."}, {"question": "What payment methods do you accept?", "answer": "PayPal and bank transfer. Payment is due upon completion, before shipping."}]}'
),
(
  'links', 'Commission Form', 6,
  '{"form_url": "", "form_label": "Request a Commission", "note": "Please read everything above before submitting."}'
);
