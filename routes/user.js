const express = require('express');
const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');
const router = express.Router();

//get all user
router.get('/',middlewareController.verifyToken, userController.getAllUsers); //middleware to verify token trước khi lấy tất cả user

//delete user by id
router.delete('/:id', middlewareController.verifyTokenAndAdmin, userController.deleteUser); //middleware to verify token and admin trước khi xóa user

module.exports = router;