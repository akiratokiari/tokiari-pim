-- Users テーブル
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text not null, -- メールアドレス

  postal_code text, -- 郵便番号
  prefecture text, -- 都道府県
  city text, -- 市区町村
  street_address text, -- 番地
  address_option text, -- 建物・部屋名

  company text, -- 会社名
  phone text, -- 電話番号
  contact_name text, -- 担当者(名前)
  site_url text, -- サイト

  card_item JSON, -- 購入アイテムリスト

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- alter table public.users enable row level security;

-- PurchaseLog テーブル
CREATE TABLE public.purchaseLog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_intent text, --Stripeの決済Intent

  postal_code text, -- 郵便番号
  prefecture text, -- 都道府県
  city text, -- 市区町村
  street_address text, -- 番地
  address_option text, -- 建物・部屋名

  price int, -- 値段
  status int, -- 決済状況
  is_send BOOLEAN, -- 発送したか
  purchased_item JSON, -- 購入アイテムリスト
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- alter table public.purchaseLog enable row level security;
