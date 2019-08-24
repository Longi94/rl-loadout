ALTER TABLE public.antenna ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.body ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.decal ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.topper ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.wheel ALTER COLUMN id DROP DEFAULT;

DROP SEQUENCE public.antenna_id_seq;
DROP SEQUENCE public.body_id_seq;
DROP SEQUENCE public.decal_id_seq;
DROP SEQUENCE public.topper_id_seq;
DROP SEQUENCE public.wheel_id_seq;
