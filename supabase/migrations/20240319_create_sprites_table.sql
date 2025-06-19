-- Create the sprites table
CREATE TABLE IF NOT EXISTS public.sprites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  animations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create a function to create the sprites table
CREATE OR REPLACE FUNCTION create_sprites_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.sprites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    animations JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
  );
END;
$$ LANGUAGE plpgsql; 