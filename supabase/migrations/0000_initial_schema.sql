-- The Scarlet Thread Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: roles
create table roles (
  id uuid primary key default uuid_generate_v4(),
  name varchar(50) unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: users (extending auth.users)
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  role_id uuid references roles(id) on delete set null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: products
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete restrict,
  name varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  is_personalized boolean default false,
  personalization_price numeric(10,2) default 0,
  stock_status varchar(50) default 'in_stock', -- in_stock, out_of_stock, backorder
  stock_quantity integer default 0,
  is_active boolean default true,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: product_images
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_text text,
  is_primary boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: personalization_templates
create table personalization_templates (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  allowed_fields jsonb not null, -- e.g., ["name", "custom_text", "photo", "logo"]
  max_characters integer,
  allowed_fonts jsonb, -- e.g., ["Elegant Script", "Modern Sans"]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: addresses
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  title varchar(100) default 'Home',
  full_name varchar(255) not null,
  phone varchar(50) not null,
  address_line1 text not null,
  address_line2 text,
  city varchar(100) not null,
  state varchar(100) not null,
  postal_code varchar(20) not null,
  country varchar(100) default 'India',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  status varchar(50) default 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) default 0,
  discount_amount numeric(10,2) default 0,
  coupon_code varchar(50),
  payment_method varchar(50),
  payment_status varchar(50) default 'pending', -- pending, paid, failed, refunded
  payment_intent_id varchar(255),
  shipping_address_id uuid references addresses(id) on delete restrict,
  billing_address_id uuid references addresses(id) on delete restrict,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: order_items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  personalization_data jsonb, -- stores chosen name, font, text, photo URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: reviews
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title varchar(255),
  comment text,
  status varchar(50) default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table roles enable row level security;
alter table users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table personalization_templates enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;

-- Policies

-- Public Read Access for Catalog
create policy "Public profiles are viewable by everyone." on users for select using (true);
create policy "Categories are viewable by everyone." on categories for select using (true);
create policy "Products are viewable by everyone." on products for select using (true);
create policy "Product images are viewable by everyone." on product_images for select using (true);
create policy "Personalization templates are viewable by everyone." on personalization_templates for select using (true);
create policy "Approved reviews are viewable by everyone." on reviews for select using (status = 'approved');

-- Users can read/write their own data
create policy "Users can update own profile." on users for update using (auth.uid() = id);
create policy "Users can view own addresses." on addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses." on addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses." on addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses." on addresses for delete using (auth.uid() = user_id);

create policy "Users can view own orders." on orders for select using (auth.uid() = user_id);
create policy "Users can view own order items." on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
