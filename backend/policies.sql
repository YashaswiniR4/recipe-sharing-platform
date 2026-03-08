-- Enable RLS and policies

-- Recipes: allow anyone to read
alter table if exists recipes enable row level security;
create policy "public_read" on recipes for select using (true);

-- Recipes: allow authenticated users to insert their own recipes
create policy "insert_own" on recipes for insert with check (auth.uid() = user_id);

-- Recipes: allow owners to update/delete
create policy "owners_modify" on recipes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners_delete" on recipes for delete using (auth.uid() = user_id);

-- Favorites: allow owner to insert/delete, allow user to select own favorites
alter table if exists favorites enable row level security;
create policy "favorites_insert_own" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_select_own" on favorites for select using (auth.uid() = user_id);
create policy "favorites_delete_own" on favorites for delete using (auth.uid() = user_id);

-- Ratings: allow insert if user matches and prevent duplicate rating via db constraint or application logic
alter table if exists ratings enable row level security;
create policy "ratings_insert_own" on ratings for insert with check (auth.uid() = user_id);
create policy "ratings_select" on ratings for select using (true);
create policy "ratings_delete_own" on ratings for delete using (auth.uid() = user_id);

-- Comments
alter table if exists comments enable row level security;
create policy "comments_insert_own" on comments for insert with check (auth.uid() = user_id);
create policy "comments_select" on comments for select using (true);
create policy "comments_delete_own" on comments for delete using (auth.uid() = user_id);
