const pool = require('../Config/dbConfig');
const asyncWrapper = require("../middleware/asyncWrapper");
const generateJWT = require('../middleware/generateJWT');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const generateOTP = require('../utils/generateOTP');
const otp = generateOTP();
const sendEmail = require('../Services/emailService');
const updateNumLogin = require('../utils/updateNumLogin');

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


exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const queryUser = `SELECT * FROM users WHERE email = $1`;
    const user = await pool.query(queryUser, [email]);
    const userData = user.rows[0];
    
    if (!userData) {
        return next(new appError('Invalid email or password', 400));
    }

    if(!userData.verified) {
        return next(new appError('Please verify your email', 401));
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
        return next(new appError('Invalid email or password', 400));
    }

    const token = await generateJWT({id: userData.id, role: userData.role});

    await updateNumLogin(userData.id);
    res.status(200).json({
        status: 'success',
        token: token
    });

});


exports.verifyOTP = asyncWrapper(async (req, res, next) => {
    const { email, otp } = req.body;

    const verifyOTP = `SELECT * FROM verifyOtp WHERE email = $1 AND otp = $2`;
    const verify = await pool.query(verifyOTP, [email, otp]);
    const optRecord = verify.rows[0];

    if (verify.rows.length === 0) {
        return next(new appError('Invalid OTP', 400));
    }

    // check if the OTP has expired
    const currentTime = new Date();
    const otpExpiration = new Date(optRecord.created_at);
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    if (currentTime > otpExpiration) {
        return next(new appError('OTP has expired', 400));
    }

    const updateUser = `UPDATE users SET verified = true WHERE email = $1 RETURNING *`;
    const user = await pool.query(updateUser, [email]);

    await pool.query('DELETE FROM verifyOtp WHERE email = $1', [email]);

    res.status(200).json({
        status: 'success',
        message: 'OTP verified successfully',
        data: {
            user: user.rows[0]
        }
    });

});


