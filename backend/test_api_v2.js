const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    // Use the new port from .env if we are testing the actual server, 
    // but here we are testing the DB connection logic
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Yashunayak@404',
        database: process.env.DB_NAME || 'recipe_db',
    });

    const search = '';
    const category = '';
    const page = 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    // Use query instead of execute to verify the fix
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [parseInt(limit), parseInt(offset)];

    console.log('Query:', query + ' LIMIT ? OFFSET ?');
    console.log('Params:', params);

    try {
        const [recipes] = await db.query(query + ' LIMIT ? OFFSET ?', params);
        console.log('Recipes found:', recipes.length);
        if (recipes.length > 0) {
            console.log('First recipe title:', recipes[0].title);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await db.end();
    }
}

test();
