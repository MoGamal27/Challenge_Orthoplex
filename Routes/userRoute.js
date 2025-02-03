const { getUserById, getTopUsers } = require('../Controller/userController');
const express = require('express');
const router = express.Router();

router.get('/topUsers', getTopUsers);


router.get('/:id', getUserById);


module.exports = router;