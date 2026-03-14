-- ============================================
-- Migration: Add image_url to trips table
-- ============================================

ALTER TABLE public.trips ADD COLUMN image_url text;
comment on column public.trips.image_url is '旅行プランのカバー画像のURL';