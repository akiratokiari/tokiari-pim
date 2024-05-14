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

-- Purchased Products テーブル
CREATE TABLE public.purchased_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  -- 販売商品情報
  gtin_code TEXT, -- 商品コード
  quantity INT, -- 販売数
  amount INT, -- 価格

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
