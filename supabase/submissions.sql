create table if not exists public.submissions (
  id uuid primary key,
  name text not null,
  phone text not null,
  email text not null,
  blood_group text not null,
  condition text not null,
  batch_type text not null,
  goal text not null,
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
