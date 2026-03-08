# Frontend (React + Vite + Supabase)

A full-featured React recipe sharing application with authentication, CRUD operations, image upload, ratings, comments, favorites, and pagination.

## Features

- **Authentication**: User registration and login via Supabase Auth
- **Recipe CRUD**: Create, read, update, delete recipes
- **Image Upload**: Upload recipe images to Supabase Storage
- **Search & Filter**: Search recipes by title, filter by category, sort by newest/oldest/highest rated
- **Ratings**: Rate recipes 1-5 stars (prevents duplicate ratings per user)
- **Comments**: Add and view comments on recipes
- **Favorites**: Save and view favorite recipes
- **Pagination**: Browse recipes with pagination (6 per page)
- **User Profile**: View profile with total recipes and favorites
- **Responsive UI**: Mobile and desktop friendly

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase project (https://app.supabase.com)

### Installation

1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddRecipe.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── MyRecipes.jsx
│   │   ├── Favorites.jsx
│   │   └── Profile.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RatingStars.jsx
│   │   └── CommentSection.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── supabaseClient.js
├── index.html
├── vite.config.js
├── package.json
└── .env.local (create from .env.example)
```

## Key Components

- **supabaseClient.js**: Initializes Supabase JS client
- **Navbar.jsx**: Navigation with logout button
- **RecipeCard.jsx**: Displays recipe preview in grid
- **RatingStars.jsx**: Star rating display component
- **CommentSection.jsx**: Add/view comments on recipes

## Pages

- **Dashboard**: View all recipes with pagination
- **Login/Register**: Authentication pages
- **AddRecipe**: Create new recipe with image upload
- **RecipeDetail**: View full recipe, rate, comment, favorite
- **MyRecipes**: View and delete own recipes
- **Favorites**: View saved favorite recipes
- **Profile**: User profile with stats

## API Integration

The app uses the Supabase JS SDK for:
- Authentication (signup, login, logout)
- Database operations (CRUD for recipes, ratings, comments, favorites)
- Storage (image upload and public URL retrieval)

## Notes

- Authentication is required for adding, editing, deleting recipes and for rating/commenting
- Images are uploaded to the `recipe-images` storage bucket
- RLS (Row Level Security) policies are enforced server-side
- Average rating is updated automatically via database triggers
