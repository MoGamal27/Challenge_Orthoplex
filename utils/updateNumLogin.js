const  pool  = require('../Config/dbConfig');
const updateNumLogin = async (id) => {
    const query = `UPDATE users SET NumberOfLogin = NumberOfLogin + 1 WHERE id = $1`;
    await pool.query(query, [id]);
}

module.exports = updateNumLogin;
