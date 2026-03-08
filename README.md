# GourmetShare • Modern Recipe Sharing Platform

A premium full-stack Recipe Sharing Platform where users can create, share, discover, and interact with recipes. 

> [!IMPORTANT]
> This version has been migrated to a **Node.js + Express + MySQL** stack with **Cloudinary** for image storage.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based login/register with password hashing.
- **🍲 Recipe Management**: Full CRUD (Create, Read, Update, Delete) with image uploads.
- **📸 Image Upload**: Seamless integration with Cloudinary for fast, reliable image hosting.
- **🔎 Dynamic Search & Filtering**: Search by title and filter by categories (Indian, Italian, Vegan, etc.).
- **⭐ Recipe Rating System**: 1-5 star ratings with live average calculation.
- **❤️ Favorite System**: Save your favorite recipes to a personal collection.
- **💬 Community Interaction**: Real-time comments section on every recipe.
- **👤 User Profiles**: Personal dashboard with activity statistics and recipe management.
- **🎨 Premium UI**: Modern, responsive design with glassmorphism, Outfit typography, and smooth animations.

## 📂 Project Structure

```
Recipe sharing platform/
├── backend/                  # Node.js + Express Server
│   ├── index.js             # Main server logic & API routes
│   ├── mysql_schema.sql     # Database table definitions
│   ├── package.json         # Backend dependencies
│   └── .env                 # API keys & DB config (Create this!)
│
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── pages/          # All application views
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API abstraction layer (Axios)
│   │   ├── App.jsx         # Routing & Auth guards
│   │   └── styles.css      # Premium Design System
│   ├── package.json        # Frontend dependencies
│   └── index.html          # Entry point & Font loading
└── README.md                # This file
```

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Axios, React Router, Outfit Font.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS.
- **Image Storage**: Cloudinary.

## 📋 Setup Instructions

### 1. Database Setup (MySQL)
1. Create a database named `recipe_db`.
2. Run the SQL script found in `backend/mysql_schema.sql` to create the tables.

### 2. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   npm install
   ```
2. Open `.env` and fill in your credentials:
   - `DB_USER` & `DB_PASSWORD` for your MySQL.
   - `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET` from your Cloudinary dashboard.
   - `JWT_SECRET` (any long random string).
3. Start the server:
   ```bash
   npm run dev
   ```
   *Server runs on http://localhost:3001*

### 3. Frontend Configuration
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *App runs on http://localhost:5173*

## 📖 Features Overview

### Dashboard
Discover the latest recipes. Use the search bar for quick finding and category pills for fast filtering.

### Add Recipe
Upload your culinary creations. Fill in the title, ingredients, and method. Attach a mouth-watering photo handled by Cloudinary.

### Favorites
Save recipes you love. They'll be waiting for you in your personal Favorites tab accessible from the Navbar.

### Profile
Manage everything you've shared. Monitor your popularity with stats on how many recipes you've posted and favorites you've earned.

---

**Developed with ❤️ by GourmetShare Team**
