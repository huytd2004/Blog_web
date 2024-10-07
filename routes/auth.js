const express = require('express');
const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');
const router = express.Router();
//register
router.post('/register',authController.registerUser);
//login
router.post('/login',authController.loginUser);
//refresh token
router.post('/refresh',authController.requestRefreshToken);
//logout
router.post('/logout',middlewareController.verifyToken,authController.logoutUser);
module.exports = router;