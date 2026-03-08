USE recipe_db;

-- Add Fast Food examples
INSERT INTO recipes (title, description, ingredients, category, image_url, user_id) VALUES 
('Double Decker Cheese Burger', 'A mouth-watering burger with double patties, extra cheese, and our secret sauce.', 'Beef patties, Brioche buns, Cheddar cheese, Lettuce, Tomato, Onions, Secret Sauce', 'Fast Food', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 1),
('Crispy Fried Chicken', 'Golden and crispy on the outside, juicy on the inside.', 'Chicken pieces, Flour, Buttermilk, Salt, Black pepper, Paprika, Oregano', 'Fast Food', 'https://images.unsplash.com/photo-1626645738196-c2a7c8d08f58?auto=format&fit=crop&w=800&q=80', 1);

-- Add Vegan examples
INSERT INTO recipes (title, description, ingredients, category, image_url, user_id) VALUES 
('Mediterranean Quinoa Salad', 'A refreshing and nutritious vegan salad with quinoa and fresh vegetables.', 'Quinoa, Cucumber, Cherry tomatoes, Red onion, Parsley, Lemon juice, Olive oil', 'Vegan', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 1),
('Vegan Chocolate Lava Cake', 'Rich and gooey chocolate lava cake that is completely vegan and delicious.', 'Flour, Cocoa powder, Sugar, Baking powder, Almond milk, Coconut oil, Dark chocolate', 'Vegan', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', 1);
