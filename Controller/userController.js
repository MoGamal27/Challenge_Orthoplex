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

// Update user
exports.updateUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const { name, email } = req.body
    
    const query = `
        UPDATE users 
        SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, email, verified, role, numberoflogin, created_at, updated_at
    `
    const user = await pool.query(query, [name, email, id])
    
    if (!user.rows.length) {
        return next(new appError('User not found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: { user: user.rows[0] }
    })
})

// Delete user
exports.deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    
    const query = `DELETE FROM users WHERE id = $1 RETURNING id`
    const result = await pool.query(query, [id])
    
    if (!result.rows.length) {
        return next(new appError('User not found', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

// Get Top 3 Users by Login Frequency
exports.getTopUsers = asyncWrapper(async (req, res, next) => {
    const query = `
        SELECT id, name, email, numberoflogin, created_at
        FROM users
        ORDER BY numberoflogin DESC
        LIMIT 3
    `
    const topUsers = await pool.query(query)

    res.status(200).json({
        status: 'success',
        data: { users: topUsers.rows }
    })
})



