const { signUp } = require('../Controller/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', signUp);

module.exports = router