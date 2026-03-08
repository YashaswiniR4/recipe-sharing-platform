# Useful SQL queries and RPC examples for Supabase

1) Fetch recipes with aggregated stats (join `recipe_stats` view):

SELECT r.*, rs.ratings_count, rs.avg_rating, rs.favorites_count
FROM recipes r
LEFT JOIN recipe_stats rs ON rs.recipe_id = r.id
ORDER BY r.created_at DESC
LIMIT 6 OFFSET 0;

2) Fetch single recipe with comments and author email:

SELECT r.*, u.email as author_email
FROM recipes r
LEFT JOIN auth.users u ON u.id = r.user_id
WHERE r.id = 'RECIPE_UUID';

SELECT c.*, u.email FROM comments c LEFT JOIN auth.users u ON u.id = c.user_id WHERE c.recipe_id = 'RECIPE_UUID' ORDER BY created_at DESC;

3) RPC example: create an RPC function to return paginated recipes with stats (optional - run in SQL editor):

create or replace function rpc_get_recipes_paginated(p_limit int, p_offset int)
returns table (
  id uuid,
  title text,
  description text,
  image_url text,
  category text,
  average_rating numeric,
  ratings_count int,
  favorites_count int,
  created_at timestamp with time zone
) as $$
begin
  return query
  select r.id, r.title, r.description, r.image_url, r.category, coalesce(rs.avg_rating,0) as average_rating, coalesce(rs.ratings_count,0) as ratings_count, coalesce(rs.favorites_count,0) as favorites_count, r.created_at
  from recipes r
  left join recipe_stats rs on rs.recipe_id = r.id
  order by r.created_at desc
  limit p_limit offset p_offset;
end;
$$ language plpgsql security definer;

4) Notes:
- Use unique constraints on `ratings(user_id, recipe_id)` and `favorites(user_id, recipe_id)` to prevent duplicates; application should also check before inserting to provide better UX.
- Triggers are provided in `advanced.sql` to keep `recipes.average_rating` up-to-date.
