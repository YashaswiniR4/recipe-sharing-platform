require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recipe_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer for image processing
const storage = multer.memoryStorage();
const upload = multer({ storage });

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- RECIPE ROUTES ---
app.get('/api/recipes', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = (pageNum - 1) * limitNum;

    let query = 'SELECT r.*, u.name as author_name FROM recipes r LEFT JOIN users u ON r.user_id = u.id WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM recipes WHERE 1=1';
    const params = [];

    if (search && search !== '') {
      query += ' AND r.title LIKE ?';
      countQuery += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }
    if (category && category !== '') {
      query += ' AND r.category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';

    const [countResult] = await db.query(countQuery, params);
    const queryParams = [...params, limitNum, offsetNum];
    const [recipes] = await db.query(query, queryParams);

    res.json({ recipes, total: countResult[0].total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const [recipe] = await db.execute(
      `SELECT r.*, u.name as author_name 
       FROM recipes r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [req.params.id]
    );
    if (recipe.length === 0) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recipes', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, category } = req.body;
    let image_url = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto" });
      image_url = uploadRes.secure_url;
    }

    const [result] = await db.execute(
      'INSERT INTO recipes (title, description, ingredients, category, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, ingredients, category, image_url, req.user.id]
    );
    res.status(201).json({ id: result.insertId, message: 'Recipe created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recipes/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, category } = req.body;
    const [old] = await db.execute('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (old.length === 0) return res.status(404).json({ message: 'Recipe not found' });
    if (old[0].user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    let image_url = old[0].image_url;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto" });
      image_url = uploadRes.secure_url;
    }

    await db.execute(
      'UPDATE recipes SET title=?, description=?, ingredients=?, category=?, image_url=? WHERE id=?',
      [title, description, ingredients, category, image_url, req.params.id]
    );
    res.json({ message: 'Recipe updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const [old] = await db.execute('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (old.length === 0) return res.status(404).json({ message: 'Recipe not found' });
    if (old[0].user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await db.execute('DELETE FROM recipes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- RATINGS ---
app.post('/api/recipes/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe_id = req.params.id;
    await db.execute(
      'INSERT INTO ratings (user_id, recipe_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
      [req.user.id, recipe_id, rating, rating]
    );

    // Update average rating
    const [avg] = await db.query('SELECT AVG(rating) as average FROM ratings WHERE recipe_id = ?', [recipe_id]);
    await db.execute('UPDATE recipes SET average_rating = ? WHERE id = ?', [avg[0].average, recipe_id]);

    res.json({ message: 'Rating updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// backward compatibility alias
app.post('/api/ratings', authenticateToken, async (req, res) => {
  try {
    const { recipe_id, rating } = req.body;
    await db.execute(
      'INSERT INTO ratings (user_id, recipe_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
      [req.user.id, recipe_id, rating, rating]
    );
    const [avg] = await db.query('SELECT AVG(rating) as average FROM ratings WHERE recipe_id = ?', [recipe_id]);
    await db.execute('UPDATE recipes SET average_rating = ? WHERE id = ?', [avg[0].average, recipe_id]);
    res.json({ message: 'Rating updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- FAVORITES ---
app.post('/api/recipes/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const recipe_id = req.params.id;
    await db.execute('INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)', [req.user.id, recipe_id]);
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { recipe_id } = req.body;
    await db.execute('INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)', [req.user.id, recipe_id]);
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:recipe_id', authenticateToken, async (req, res) => {
  try {
    await db.execute('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?', [req.user.id, req.params.recipe_id]);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const [favorites] = await db.execute(
      `SELECT r.* FROM recipes r 
         JOIN favorites f ON r.id = f.recipe_id 
         WHERE f.user_id = ?`,
      [req.user.id]
    );
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- COMMENTS ---
app.get('/api/recipes/:id/comments', async (req, res) => {
  try {
    const [comments] = await db.execute(
      `SELECT c.*, u.name as user_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.recipe_id = ? ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/comments/:recipe_id', async (req, res) => {
  try {
    const [comments] = await db.execute(
      `SELECT c.*, u.name as user_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.recipe_id = ? ORDER BY c.created_at DESC`,
      [req.params.recipe_id]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recipes/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { comment } = req.body;
    const recipe_id = req.params.id;
    const [result] = await db.execute(
      'INSERT INTO comments (user_id, recipe_id, comment) VALUES (?, ?, ?)',
      [req.user.id, recipe_id, comment]
    );
    res.json({ id: result.insertId, message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', authenticateToken, async (req, res) => {
  try {
    const { recipe_id, comment } = req.body;
    const [result] = await db.execute(
      'INSERT INTO comments (user_id, recipe_id, comment) VALUES (?, ?, ?)',
      [req.user.id, recipe_id, comment]
    );
    res.json({ id: result.insertId, message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AUTH PROFILE & USER PROFILE ---
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const [recipes] = await db.execute('SELECT * FROM recipes WHERE user_id = ?', [req.user.id]);
    const [favorites] = await db.execute('SELECT COUNT(*) as fav_count FROM favorites WHERE user_id = ?', [req.user.id]);
    res.json({
      user: req.user,
      recipes,
      stats: {
        total_recipes: recipes.length,
        total_favorites: favorites[0].fav_count
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [recipes] = await db.execute('SELECT * FROM recipes WHERE user_id = ?', [req.user.id]);
    const [favorites] = await db.execute('SELECT COUNT(*) as fav_count FROM favorites WHERE user_id = ?', [req.user.id]);
    res.json({
      user: req.user,
      recipes,
      stats: {
        total_recipes: recipes.length,
        total_favorites: favorites[0].fav_count
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
