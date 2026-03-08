# GourmetShare • Modern Recipe Sharing Platform

A premium full-stack **Recipe Sharing Platform** where users can create, share, discover, and interact with recipes. The platform provides a clean and modern experience for food enthusiasts to explore dishes and share their culinary creations.

---

# 🚀 Features

## 🔐 Secure Authentication

* User registration and login
* Password hashing using **Bcrypt**
* **JWT-based authentication** for protected routes

## 🍲 Recipe Management

* Create, edit, and delete recipes
* Upload images for recipes
* Manage personal recipes from the profile dashboard

## 📸 Image Upload

* Integrated with **Cloudinary** for fast and reliable image hosting

## 🔎 Search & Filtering

* Search recipes by title
* Filter recipes by categories such as:

  * Indian
  * Italian
  * Vegan
  * Desserts
  * Healthy

## ⭐ Rating System

* Users can rate recipes from **1–5 stars**
* Average ratings are calculated automatically

## ❤️ Favorite Recipes

* Save recipes to a personal **Favorites collection**
* Easily access saved recipes anytime

## 💬 Community Interaction

* Comment system for each recipe
* Users can interact and share feedback on dishes

## 👤 User Profiles

* Personal dashboard showing:

  * Recipes created
  * Favorite recipes
  * Activity statistics

## 🎨 Modern UI Design

* Responsive design for all devices
* Clean layout with smooth animations
* **Outfit font** for modern typography
* Glassmorphism styled navigation

---

# 📂 Project Structure

Recipe sharing platform/
│
├── backend/                  # Node.js + Express Server
│   ├── index.js              # Main server logic & API routes
│   ├── mysql_schema.sql      # Database schema
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment configuration
│
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── pages/            # Application pages
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API layer (Axios)
│   │   ├── App.jsx           # Routing configuration
│   │   └── styles.css        # Design system
│   ├── package.json
│   └── index.html
│
└── README.md

---

# 🛠 Tech Stack

### Frontend

* React 18
* Vite
* Axios
* React Router
* HTML5 / CSS3
* Outfit Google Font

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Authentication

* JWT (JSON Web Tokens)
* BcryptJS

### Image Storage

* Cloudinary

---

# 📋 Setup Instructions

## 1️⃣ Database Setup

Create a database named:

recipe_db

Run the SQL schema file located in:

backend/mysql_schema.sql

This will create all required tables.

---

## 2️⃣ Backend Setup

Navigate to the backend folder:

cd backend
npm install

Create a `.env` file and configure:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=recipe_db

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Start the backend server:

npm run dev

Backend will run on:

http://localhost:3001

---

## 3️⃣ Frontend Setup

Navigate to the frontend folder:

cd frontend
npm install
npm run dev

The application will run at:

http://localhost:5173

---

# 📖 Application Pages

### Dashboard

Browse the latest recipes. Use the search bar and category filters to quickly discover dishes.

### Add Recipe

Upload your own recipes with ingredients, instructions, and images.

### Favorites

Access recipes you’ve saved for later.

### Profile

Manage your recipes and track your activity within the platform.

---

# ❤️ Developed By

**GourmetShare Team**
