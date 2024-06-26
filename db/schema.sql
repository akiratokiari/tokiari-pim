-- DROP TABLES IF THEY EXIST
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.product_variants_size CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.purchased_products CASCADE;

-- Products テーブル
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  kana VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  product_code VARCHAR(255) NOT NULL,
  jicfs_code VARCHAR(255) NOT NULL,
  gpc_code VARCHAR(255) NOT NULL,
  publish_status INT NOT NULL DEFAULT 1,
  product_group_code VARCHAR(255) NOT NULL UNIQUE,
  sales_started_at DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Product Variants テーブル
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  series_number VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(255) NOT NULL,
  publish_status INT NOT NULL DEFAULT 1,
  price INT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Product Variants テーブル
CREATE TABLE public.product_variants_size (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,

  product_size VARCHAR(255) NOT NULL,
  model_number VARCHAR(255) NOT NULL UNIQUE,
  gtin_code VARCHAR(255) NOT NULL UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Product Images テーブル
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Users テーブル
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  postal_code TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  street_address TEXT NOT NULL,
  building_name TEXT,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_kana TEXT NOT NULL,
  site_url TEXT,
  plan INT,
  user_role INT,
  cart_items JSON,
  permission_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Orders テーブル
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_intent TEXT,
  amount INT NOT NULL,
  total_price INT NOT NULL,
  payment_status INT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  street_address TEXT NOT NULL,
  building_name TEXT,
  -- 配送Options
  option INT,
  delivery_date  TEXT,
  delivery_time TEXT,
  remarks TEXT,
  -- システム情報
  is_delivered BOOLEAN,
  delivery_code TEXT,
  delivery_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Purchased Products テーブル
CREATE TABLE public.purchased_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  -- ProductID
  productId UUID NOT NULL REFERENCES public.products(id),
  -- VariantID
  modelId UUID NOT NULL REFERENCES public.product_variants(id),
  -- VariantSizeID
  seriesId UUID NOT NULL REFERENCES public.product_variants_size(id),

  amount INT NOT NULL,
  payment_status INT NOT NULL,
  price INT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);
