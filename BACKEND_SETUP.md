# MySQL Setup Instructions

Follow these steps to set up your local MySQL database for **GourmetShare**.

## Step 1: Create Database
Login to your MySQL terminal and run:
```sql
CREATE DATABASE recipe_db;
```

## Step 2: Run SQL Schema
In your terminal, navigate to the `backend` directory and execute the following command:
```bash
mysql -u root -p recipe_db < mysql_schema.sql
```
*(Enter your MySQL root password when prompted)*

## Step 3: Configure Backend `.env`
Open `backend/.env` and update the database credentials:
- `DB_USER`: Your MySQL username (usually `root`)
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: `recipe_db`

Also, ensure you have your **Cloudinary** credentials and a **JWT_SECRET** set.

## Step 4: Start the Backend
1. Open a new terminal in the `backend` folder.
2. Run `npm install` (first time only).
3. Run `npm run dev`.

## Step 5: Start the Frontend
1. Open a new terminal in the `frontend` folder.
2. Run `npm install` (first time only).
3. Run `npm run dev`.

Access the application at: **http://localhost:5173**
🎉 Your local MySQL migration is complete!
