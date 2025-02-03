const pool = require('../../Config/dbConfig')

const sql = `
      CREATE TABLE IF NOT EXISTS verifyOtp (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

  `;
  
  (async () => {
    try {
        await pool.query(sql);
        console.log('Table verifyOtp created successfully.');
    } catch (err) {
        console.error('Error executing SQL', err.stack);
    } finally {
        await pool.end();
    }
})();