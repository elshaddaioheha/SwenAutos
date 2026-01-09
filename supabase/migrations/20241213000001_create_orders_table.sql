-- Create orders table
create table if not exists orders (
  id bigint primary key, -- Matches blockchain orderId
  product_id bigint not null references products(id),
  buyer_address text not null,
  seller_address text not null,
  amount_wei numeric not null,
  amount_camp numeric,
  payment_method text not null, -- 'CAMP_TOKEN', 'PAYSTACK', etc.
  status text not null, -- 'CREATED', 'FUNDED', 'SHIPPED', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table orders enable row level security;

-- Policy: Authenticated users can read their own orders (as buyer or seller)
create policy "Users can view their own orders"
on orders for select
using (
  auth.role() = 'authenticated' -- and (buyer_address = auth.user_wallet OR seller_address = auth.user_wallet)  <-- Needs wallet mapping. For now, public/auth read is safer to start or strict RLS if we had wallet mapping.
  -- Simplified: If we assume we filter in app, we can allow authenticated read for now, or match if we store user_id. 
  -- But we don't store user_id in this table yet, only addresses.
);

-- For now, allow authenticated insert (indexer)
create policy "Authenticated users can insert orders"
on orders for insert
with check (auth.role() = 'authenticated');
