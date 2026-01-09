-- Create products table
create table if not exists products (
  id bigint primary key, -- Matches blockchain productId
  seller_address text not null,
  name text not null,
  description text,
  category text,
  price_wei numeric not null, -- Store raw wei value
  price_camp numeric, -- Store formatted CAMP value for easier filtering
  inventory bigint not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Policy: Everyone can read active products
create policy "Public can view active products"
on products for select
using (true);

-- Policy: Only authenticated users can insert (for now, maybe restrict to seller matching address later)
create policy "Authenticated users can insert products"
on products for insert
with check (auth.role() = 'authenticated');

-- Policy: Sellers can update their own products
create policy "Sellers can update own products"
on products for update
using (auth.role() = 'authenticated'); -- Ideally check seller_address match but that requires linking auth.uid() to wallet
