-- Backend advanced SQL: constraints, triggers, helper functions

-- Prevent duplicate rating per user per recipe
alter table if exists ratings add constraint if not exists unique_user_recipe_rating unique (user_id, recipe_id);

-- Prevent duplicate favorite per user per recipe
alter table if exists favorites add constraint if not exists unique_user_recipe_favorite unique (user_id, recipe_id);

-- Function to compute and update average rating for a recipe
create or replace function update_recipe_average(p_recipe_id uuid)
returns void as $$
declare
  avg_rating numeric;
begin
  select avg(rating)::numeric(10,2) into avg_rating from ratings where recipe_id = p_recipe_id;
  if avg_rating is null then
    avg_rating := 0;
  end if;
  update recipes set average_rating = avg_rating where id = p_recipe_id;
end;
$$ language plpgsql;

-- Trigger functions for ratings table to update average after insert/update/delete
create or replace function trg_ratings_after_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    perform update_recipe_average(new.recipe_id);
    return new;
  elsif (tg_op = 'UPDATE') then
    perform update_recipe_average(new.recipe_id);
    return new;
  elsif (tg_op = 'DELETE') then
    perform update_recipe_average(old.recipe_id);
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create the trigger on ratings
drop trigger if exists trg_ratings_avg on ratings;
create trigger trg_ratings_avg
after insert or update or delete on ratings
for each row execute procedure trg_ratings_after_change();

-- Indexes to speed up common queries
create index if not exists idx_recipes_created_at on recipes(created_at desc);
create index if not exists idx_ratings_recipe on ratings(recipe_id);
create index if not exists idx_favorites_user on favorites(user_id);

-- Helpful view: recipe_stats (ratings_count, favorites_count, avg_rating)
create or replace view recipe_stats as
select
  r.id as recipe_id,
  coalesce(count(distinct ra.id),0) as ratings_count,
  coalesce(avg(ra.rating)::numeric(10,2),0) as avg_rating,
  coalesce(count(distinct f.id),0) as favorites_count
from recipes r
left join ratings ra on ra.recipe_id = r.id
left join favorites f on f.recipe_id = r.id
group by r.id;
