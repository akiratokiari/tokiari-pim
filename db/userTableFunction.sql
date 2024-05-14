-- メールアドレスが更新されたときに public.users テーブルを更新する関数
CREATE OR REPLACE FUNCTION public.update_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- public.users テーブルの該当するユーザーIDのメールアドレスを更新
  UPDATE public.users
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- auth.users テーブルのメールアドレスが更新された際にトリガーを発動
CREATE TRIGGER on_auth_user_email_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email) -- メールアドレスが実際に変更された場合のみ実行
EXECUTE PROCEDURE public.update_user_email();

-- Users テーブルに新しいユーザーを追加する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- public.users テーブルに新しいユーザーの情報を挿入
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- auth.users テーブルにユーザーが作成された際にトリガーを設定
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
