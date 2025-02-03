const asyncWrapper = require('../middleware/asyncWrapper');
const pool = require('../Config/dbConfig');
const appError = require('../utils/appError');





// Get user by ID
exports.getUserById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    
    const query = `
        SELECT id, name, email, verified, role, numberoflogin, created_at 
        FROM users 
        WHERE id = $1
    `
    const user = await pool.query(query, [id])
    
    if (!user.rows.length) {
        return next(new appError('User not found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: { user: user.rows[0] }
    })
})



