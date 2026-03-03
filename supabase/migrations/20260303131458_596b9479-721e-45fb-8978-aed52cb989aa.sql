
ALTER TABLE public.leads ADD COLUMN cupom TEXT UNIQUE;

-- Function to generate unique coupon codes like "SDT-A3X7K2"
CREATE OR REPLACE FUNCTION public.generate_unique_cupom()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN;
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_code := 'SDT-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    BEGIN
      NEW.cupom := new_code;
      done := TRUE;
    EXCEPTION WHEN unique_violation THEN
      done := FALSE;
    END;
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_cupom
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  WHEN (NEW.cupom IS NULL)
  EXECUTE FUNCTION public.generate_unique_cupom();
