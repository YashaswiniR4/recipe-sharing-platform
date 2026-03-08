const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'recipe_db',
    });

    const search = '';
    const category = '';
    const page = 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
    }
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    console.log('Query:', query);
    console.log('Params:', params);

    try {
        const [recipes] = await db.execute(query, params);
        console.log('Recipes found:', recipes.length);
        console.log('First recipe:', recipes[0]);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await db.end();
    }
}

test();
