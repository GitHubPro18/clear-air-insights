-- Create table for storing daily AQI values
CREATE TABLE public.aqi_values_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  date DATE NOT NULL,
  aqi INTEGER NOT NULL,
  category TEXT NOT NULL,
  dominant_pollutant TEXT NOT NULL,
  pm25_avg NUMERIC,
  pm10_avg NUMERIC,
  no2_avg NUMERIC,
  so2_avg NUMERIC,
  co_8hr_max NUMERIC,
  o3_8hr_max NUMERIC,
  computed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(city, date)
);

-- Enable RLS
ALTER TABLE public.aqi_values_daily ENABLE ROW LEVEL SECURITY;

-- Allow public read access (AQI data is public information)
CREATE POLICY "Anyone can read daily AQI data"
ON public.aqi_values_daily
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_aqi_values_daily_city_date ON public.aqi_values_daily(city, date DESC);