const pool = require('../../Config/dbConfig')

const sql = ` 

      CREATE TYPE user_role AS ENUM ('admin', 'user');

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE, 
        password VARCHAR(255) NOT NULL,
        NumberOfLogin INT DEFAULT 0,
        role user_role DEFAULT 'user',
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
     `;
     
(async () => {
    try {
        await pool.query(sql);
        console.log('Table User created successfully.');
    } catch (err) {
        console.error('Error executing SQL', err.stack);
    } finally {
        await pool.end();
    }
})();

