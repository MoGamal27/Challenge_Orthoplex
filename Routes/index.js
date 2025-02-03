const authRoute = require('./authRoute');
const express = require('express');
const router = express.Router();

router.use('/auth', authRoute);

module.exports = router;