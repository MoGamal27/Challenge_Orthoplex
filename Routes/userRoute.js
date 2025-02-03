const { getUserById } = require('../Controller/userController');
const express = require('express');
const router = express.Router();

router.get('/:id', getUserById);

module.exports = router;