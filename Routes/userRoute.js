const { getAllUsers, getUserById, getTopUsers, updateUser, deleteUser } = require('../Controller/userController');
const express = require('express');
const router = express.Router();

router.get('/topUsers', getTopUsers);
router.get('/', getAllUsers);


router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


module.exports = router;