const { getAllUsers, getUserById, getTopUsers, updateUser, deleteUser, getInactiveUsers } = require('../Controller/userController');
const express = require('express');
const router = express.Router();

router.get('/', getAllUsers);

router.get('/topUsers', getTopUsers);

router.get('/inactiveUsers', getInactiveUsers)


router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


module.exports = router;
