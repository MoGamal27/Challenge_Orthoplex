const { getAllUsers, getUserById, getTopUsers, updateUser, deleteUser, getInactiveUsers } = require('../Controller/userController');
const { updateValidator } = require('../utils/validator/userValidator');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const express = require('express');
const router = express.Router();

router.use(verifyToken);

router.get('/', getAllUsers);

router.get('/topUsers', getTopUsers);

router.get('/inactiveUsers', getInactiveUsers)


router.get('/:id', getUserById);

router.put('/:id', updateValidator, updateUser);

router.delete('/:id', verifyRole('admin'), deleteUser);


module.exports = router;
