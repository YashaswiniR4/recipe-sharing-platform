-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Recipes table
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ingredients text,
  category text,
  image_url text,
  user_id uuid references auth.users(id) on delete cascade,
  average_rating numeric default 0,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Favorites
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Ratings
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc', now())
);

-- Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  comment text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Trigger to update recipes.updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger trg_update_recipes_updated_at
before update on recipes
for each row execute procedure update_updated_at();
