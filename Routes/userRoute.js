const { getUserById, getTopUsers, updateUser, deleteUser } = require('../Controller/userController');
const express = require('express');
const router = express.Router();

router.get('/topUsers', getTopUsers);


router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


module.exports = router;