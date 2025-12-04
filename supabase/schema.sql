-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- This table mirrors the auth.users table and stores public user information.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  phone text,
  role text check (role in ('buyer', 'seller')),
  business_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
-- Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 2. PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  part_number text,
  price_ngn numeric not null,
  price_camp numeric not null,
  description text,
  category text,
  sub_category text,
  stock integer default 0,
  condition text,
  images text[], -- Array of image URLs
  features text[], -- Array of feature strings
  specs jsonb, -- JSON object for flexible specifications
  rating numeric default 0,
  reviews_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies for Products
-- Products are viewable by everyone
create policy "Products are viewable by everyone"
  on products for select
  using ( true );

-- Sellers can insert their own products
create policy "Sellers can insert their own products"
  on products for insert
  with check ( auth.uid() = seller_id );

-- Sellers can update their own products
create policy "Sellers can update their own products"
  on products for update
  using ( auth.uid() = seller_id );

-- Sellers can delete their own products
create policy "Sellers can delete their own products"
  on products for delete
  using ( auth.uid() = seller_id );

-- 3. REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies for Reviews
create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

create policy "Authenticated users can insert reviews"
  on reviews for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own reviews"
  on reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews"
  on reviews for delete
  using ( auth.uid() = user_id );


-- 4. AUTOMATIC PROFILE CREATION TRIGGER
-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, business_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'business_name'
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. STORAGE BUCKETS (Optional but recommended for images)
-- You'll need to create a bucket named 'product-images' in the Supabase Storage dashboard.
-- Policy to allow public access to view images
-- create policy "Public Access"
-- on storage.objects for select
-- using ( bucket_id = 'product-images' );

-- Policy to allow authenticated users to upload images
-- create policy "Authenticated users can upload"
-- on storage.objects for insert
-- with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
