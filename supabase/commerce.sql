create extension if not exists "pgcrypto";

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  currency_code text not null default 'INR',
  currency_symbol text not null default 'Rs.',
  support_email text not null,
  support_phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_slug text not null references public.categories(slug) on update cascade,
  name text not null,
  sku text not null unique,
  short_description text not null,
  description text,
  badge text,
  image_url text not null,
  gallery jsonb not null default '[]'::jsonb,
  base_price integer not null check (base_price >= 0),
  sale_price integer not null check (sale_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  rating numeric(2,1) not null default 4.7,
  review_count integer not null default 0,
  video_url text,
  reviews jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  kind text not null,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  discount_value integer not null check (discount_value >= 0),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  discount_value integer not null check (discount_value >= 0),
  minimum_order_amount integer not null default 0 check (minimum_order_amount >= 0),
  usage_limit integer,
  usage_count integer not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null,
  fulfillment_status text not null,
  payment_provider text not null,
  payment_status text not null,
  payment_reference text,
  subtotal integer not null check (subtotal >= 0),
  discount integer not null default 0 check (discount >= 0),
  shipping integer not null default 0 check (shipping >= 0),
  tax integer not null default 0 check (tax >= 0),
  total integer not null check (total >= 0),
  coupon_code text,
  shipping_address jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  total_price integer not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  partner text not null,
  awb text,
  status text not null,
  tracking_url text,
  label_url text,
  pickup_scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on public.products(category_slug);
create index if not exists products_featured_idx on public.products(featured);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists shipments_order_id_idx on public.shipments(order_id);
