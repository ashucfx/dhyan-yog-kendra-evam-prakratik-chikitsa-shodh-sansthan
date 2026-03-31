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

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  line1 text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
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
  video_url text,
  benefits jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
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
  user_id uuid references auth.users(id) on delete set null,
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

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists products_category_slug_idx on public.products(category_slug);
create index if not exists products_featured_idx on public.products(featured);
create index if not exists addresses_user_id_idx on public.addresses(user_id);
create index if not exists cart_items_user_id_idx on public.cart_items(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists shipments_order_id_idx on public.shipments(order_id);
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id);

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_reviews enable row level security;
alter table public.offers enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "addresses_manage_own" on public.addresses;
create policy "addresses_manage_own" on public.addresses
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
for select to anon, authenticated
using (true);

drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active" on public.products
for select to anon, authenticated
using (active = true);

drop policy if exists "offers_public_read_active" on public.offers;
create policy "offers_public_read_active" on public.offers
for select to anon, authenticated
using (active = true);

drop policy if exists "coupons_authenticated_read" on public.coupons;
create policy "coupons_authenticated_read" on public.coupons
for select to authenticated
using (true);

drop policy if exists "product_reviews_public_read" on public.product_reviews;
create policy "product_reviews_public_read" on public.product_reviews
for select to anon, authenticated
using (true);

drop policy if exists "product_reviews_authenticated_insert" on public.product_reviews;
create policy "product_reviews_authenticated_insert" on public.product_reviews
for insert to authenticated
with check (true);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
for select to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "shipments_select_own" on public.shipments;
create policy "shipments_select_own" on public.shipments
for select to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = shipments.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "cart_items_manage_own" on public.cart_items;
create policy "cart_items_manage_own" on public.cart_items
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
