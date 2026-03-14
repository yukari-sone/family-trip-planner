-- ============================================
-- Migration: Add day_part to trip_spots
-- ============================================

ALTER TABLE public.trip_spots ADD COLUMN day_part varchar(20);
comment on column public.trip_spots.day_part is '時間帯（morning, afternoon, eveningなど）';