-- Users テーブル
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL, -- メールアドレス

  -- お届け先情報
  postal_code TEXT, -- 郵便番号
  prefecture TEXT, -- 都道府県
  city TEXT, -- 市区町村
  street_address TEXT, -- 番地
  building_name TEXT, -- 建物・部屋番号

  -- 会社情報
  company TEXT, -- 会社名
  phone TEXT, -- 電話番号
  contact_name TEXT, -- 担当者(名前)
  site_url TEXT, -- サイト

  -- 卸販売プラン
  plan INT,
  
  -- Admin
  role INT,

  -- カート
  cart_items JSON,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders テーブル
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- 決済情報
  payment_intent TEXT, -- Stripeの決済ID
  amount INT, -- 金額
  status INT, -- 決済状況

  -- 配送情報
  shipping_address JSON, -- お届け先情報
  is_shipped BOOLEAN, -- 発送したか

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 販売商品情報

  -- 商品名
  title VARCHAR,
  -- 商品名（フリガナ）
  furigana VARCHAR,
  -- 自社商品カテゴリ
  category VARCHAR,
  -- 取扱品目コード
  product_code VARCHAR,
  -- JICFS分類コード
  jicfs_code VARCHAR,
  -- GPCコード
  gpc_code VARCHAR,
  -- 商品グループコード
  product_group_code VARCHAR,
  -- 品番（自社シリーズ）
  series_number VARCHAR,
  -- 型番（自社SKU)
  model_number VARCHAR,
  -- サイズ
  size VARCHAR,
  -- サイズ
  color VARCHAR,
  -- GTIN（JANコード）
  gtin_code VARCHAR,
  -- 発売日
  sales_started_at DATE,
  -- 販売価格
  selling_price DECIMAL(10, 2),
  -- 原価
  cost_price DECIMAL(10, 2),
  -- 素材
  material VARCHAR,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
