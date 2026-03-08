# GourmetShare Backend (Node.js + MySQL)

The backend for **GourmetShare** is built with **Node.js** and **Express**, using **MySQL** as its primary database. It manages authentication, recipes, ratings, favorites, and comments.

## 📁 Structure

- `index.js`: Main server entry point and API definitions.
- `mysql_schema.sql`: SQL script to initialize the database tables.
- `.env`: Environment variables (DB credentials, Cloudinary, JWT Secret).
- `package.json`: Backend dependencies.

## 🛠 Prerequisites

- **Node.js** (v14+)
- **MySQL Server**
- **Cloudinary Account** (for image storage)

## 🚀 Setup

### 1. Database
Create a database in your MySQL server:
```sql
CREATE DATABASE recipe_db;
```
Run the `mysql_schema.sql` script to create tables:
```bash
mysql -u root -p recipe_db < mysql_schema.sql
```

### 2. Environment Variables
Create a `.env` file in this directory with the following:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=recipe_db
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

### 3. Install & Start
```bash
npm install
npm run dev
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive JWT.

### Recipes
- `GET /api/recipes`: List recipes (supports search, category, pagination).
- `GET /api/recipes/:id`: Get detailed recipe info including author.
- `POST /api/recipes`: Create recipe (authenticated, supports image upload).
- `PUT /api/recipes/:id`: Update recipe (authenticated, author only).
- `DELETE /api/recipes/:id`: Delete recipe (authenticated, author only).

### Social
- `POST /api/ratings`: Rate a recipe (1-5).
- `POST /api/favorites`: Add to favorites.
- `DELETE /api/favorites/:id`: Remove from favorites.
- `GET /api/comments/:recipe_id`: Get comments for a recipe.
- `POST /api/comments`: Add a comment.

### User
- `GET /api/user/profile`: Get logged-in user's profile and recipe stats.
