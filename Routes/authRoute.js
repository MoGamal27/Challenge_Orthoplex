const { signUp, login, verifyOTP } = require('../Controller/authController');
const { signupValidator, loginValidator } = require('../utils/validator/authValidator');
const express = require('express');
const router = express.Router();

router.post('/signup', signupValidator, signUp);
router.post('/login', loginValidator ,login);
router.post('/verifyOTP', verifyOTP);

module.exports = router