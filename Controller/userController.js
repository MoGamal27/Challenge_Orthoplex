const asyncWrapper = require('../middleware/asyncWrapper');
const pool = require('../Config/dbConfig');
const appError = require('../utils/appError');


exports.getAllUsers = asyncWrapper(async (req, res, next) => {
    const { name, email, verified, startDate, endDate } = req.query
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    
    let query = `
        SELECT 
            id, name, email, verified, role, numberoflogin, created_at 
        FROM users 
        WHERE 1=1`
    
    const values = []
    let paramCount = 1

    // Add filters
    if (name) {
        query += ` AND name ILIKE $${paramCount}`
        values.push(`%${name}%`)
        paramCount++
    }

    if (email) {
        query += ` AND email ILIKE $${paramCount}`
        values.push(`%${email}%`)
        paramCount++
    }

    if (verified !== undefined) {
        query += ` AND verified = $${paramCount}`
        values.push(verified === 'true')
        paramCount++
    }

    if (startDate) {
        query += ` AND created_at >= $${paramCount}`
        values.push(new Date(startDate))
        paramCount++
    }

    if (endDate) {
        query += ` AND created_at <= $${paramCount}`
        values.push(new Date(endDate))
        paramCount++
    }

    //pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    values.push(limit, offset)

    // Count total users
    const totalUsersQuery = `
    SELECT COUNT(*) FROM users;
  `;

  // Count verified users
    const verifiedUserQuery = `
    SELECT COUNT(*) FROM users WHERE verified = true;
  `;
   
    let [result, verifiedUsers, totalUsers] = await Promise.all([
    pool.query(query, values),
    pool.query(verifiedUserQuery),
    pool.query(totalUsersQuery),
])

    verifiedUsers = parseInt(verifiedUsers.rows[0].count, 10);
    totalUsers = parseInt(totalUsers.rows[0].count, 10);


    res.status(200).json({
    status: 'success',   
    data: result.rows,
    displayedUsers: result.rows.length,
    registeredUsers: totalUsers,
    verifiedUsers,

   });
})


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

// Get Inactive Users
exports.getInactiveUsers = asyncWrapper(async (req, res, next) => {
    const { period } = req.query // 'hour' or 'month'

    if(!period || (period !== 'hour' && period !== 'month')) {
        return next(new appError('Invalid period', 400))
    }
    
    const timeInterval = period === 'hour' ? 'INTERVAL \'1 hour\'' : 'INTERVAL \'1 month\''
    
    const query = `
        SELECT id, name, email, numberoflogin, updated_at
        FROM users
        WHERE updated_at < NOW() - ${timeInterval}
        ORDER BY updated_at DESC
    `
    const inactiveUsers = await pool.query(query)

    res.status(200).json({
        status: 'success',
        results: inactiveUsers.rows.length,
        data: { users: inactiveUsers.rows }
    })
})

