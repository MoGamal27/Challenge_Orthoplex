const pool = require('../Config/dbConfig');
const asyncWrapper = require("../middleware/asyncWrapper");
const generateJWT = require('../middleware/generateJWT');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const generateOTP = require('../utils/generateOTP');
const otp = generateOTP();
const sendEmail = require('../Services/emailService');


exports.signUp = asyncWrapper(async (req, res, next) => {
    const { name , email, password } = req.body;

    const existUser = `SELECT * FROM users WHERE email = $1`;
    const user = await pool.query(existUser, [email]);
    
    if ( user.rows.length > 0) {
        return next(new appError('User already exist', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const queryUser = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const userData = await pool.query(queryUser, [name, email, hashedPassword]);

    const newUser = userData.rows[0];

    const queryOTP = `INSERT INTO verifyOtp (email, otp) VALUES ($1, $2) RETURNING *`;
     await pool.query(queryOTP, [email, otp]);

     await sendEmail({
        email: email,
        subject: 'OTP Verification',
        html: `<p>Your OTP is ${otp}</p>`
     });

   const token = await generateJWT({id: newUser.id, role: newUser.role});

     res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
            token: token
        }
     });
    
});