const { signUp, login, verifyOTP } = require('../Controller/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verifyOTP', verifyOTP);

module.exports = router