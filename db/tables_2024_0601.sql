-- DROP TABLES IF THEY EXIST
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.purchased_products CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- Products テーブル
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- システム情報
  publish_status INT  NOT NULL DEFAULT 2,

  -- 商品名
  title VARCHAR(255) NOT NULL,
  -- 商品名（フリガナ）
  furigana VARCHAR(255)  NOT NULL,
  -- 自社商品カテゴリ
  category VARCHAR(255)  NOT NULL,
  -- 取扱品目コード
  product_code VARCHAR(255)  NOT NULL,
  -- JICFS分類コード
  jicfs_code VARCHAR(255)  NOT NULL,
  -- GPCコード
  gpc_code VARCHAR(255)  NOT NULL,
  -- 商品グループコード
  product_group_code VARCHAR(255)  NOT NULL,
  -- 品番（自社シリーズ）
  series_number VARCHAR(255)  NOT NULL,
  -- 型番（自社SKU)
  model_number VARCHAR(255)  NOT NULL,
  -- サイズ
  product_size VARCHAR(255)  NOT NULL,
  -- サイズ
  color VARCHAR(255)  NOT NULL,
  -- GTIN（JANコード）
  gtin_code VARCHAR(255)  NOT NULL,
  -- 発売日
  sales_started_at DATE  NOT NULL,
  -- 販売価格
  selling_price INT  NOT NULL,
  -- 原価
  cost_price INT  NOT NULL,
  -- 素材
  material VARCHAR(255) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users テーブル
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE, -- メールアドレス

  -- お届け先情報
  postal_code TEXT NOT NULL, -- 郵便番号
  prefecture TEXT NOT NULL, -- 都道府県
  city TEXT NOT NULL, -- 市区町村
  street_address TEXT NOT NULL, -- 番地
  building_name TEXT, -- 建物・部屋番号

  -- 会社情報
  company TEXT NOT NULL, -- 会社名
  phone TEXT NOT NULL, -- 電話番号
  contact_name TEXT NOT NULL, -- 担当者(名前)
  contact_kana TEXT NOT NULL, -- 担当者(フリガナ)
  site_url TEXT, -- サイト

  -- 卸販売プラン
  plan INT,
  -- 役割 1 = 仮登録, 2 = バイヤー, 3 = 管理画面
  user_role INT,

  -- カート
  cart_items JSON,

  -- 登録日時
  permission_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders テーブル
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- 決済情報
  payment_intent TEXT, -- Stripeの決済ID
  amount INT NOT NULL, -- 金額
  payment_status INT NOT NULL, -- 決済状況
  -- お届け先情報
  company TEXT NOT NULL, -- 会社名
  phone TEXT NOT NULL, -- 電話番号
  contact_name TEXT NOT NULL, -- 担当者(名前)
  contact_kana TEXT NOT NULL, -- 担当者(フリガナ)
  postal_code TEXT NOT NULL, -- 郵便番号
  prefecture TEXT NOT NULL, -- 都道府県
  city TEXT NOT NULL, -- 市区町村
  street_address TEXT NOT NULL, -- 番地
  building_name TEXT, -- 建物・部屋番号
  -- システム情報
  is_delivered BOOLEAN, -- 発送したか

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchased Products テーブル
CREATE TABLE public.purchased_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),

  -- 販売商品情報
  quantity INT, -- 販売数
  amount INT, -- 価格

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Images テーブル
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,

  -- 画像URL
  image_url VARCHAR(255),
  -- 商品名（フリガナ）
  image_order INT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの追加
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_purchased_products_order_id ON public.purchased_products(order_id);
CREATE INDEX idx_purchased_products_product_id ON public.purchased_products(product_id);