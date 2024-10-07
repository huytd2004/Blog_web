const User = require('../models/user');
const bcrypt = require('bcrypt'); // bcrypt để hash password
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { path } = require('express/lib/application');

let refreshTokens = []; // lưu trữ refresh token

const authController = {
    // register
    registerUser: async (req, res) => {
        try{
            const salt = await bcrypt.genSalt(10); // salt là một string random được thêm vào password trước khi hash
            const hashed = await bcrypt.hash(req.body.password, salt); // hash password với salt
            //create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            });
            //save to db
            const user = await newUser.save(); 
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ message: err.message }); // res.json() trả về một object JSON
        }
    },
    //generate new access token
    generateAccessToken: (user) => {
        return jwt.sign({ // tạo token với arg1 là payload (data), arg2 là secret key, arg3 là option
            id: user.id,
            admin: user.admin
        }, process.env.JWT_ACCESS_KEY, { expiresIn: '60s' }); 
    },
    //generate new refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({ 
            id: user.id,
            admin: user.admin
        }, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' });
    },
    //login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if(!user) {
                res.status(400).json({ message: 'User not found' });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword) {
                res.status(400).json({ message: 'Password is not correct' });
            }
            if(user && validPassword) {
                const accessToken = authController.generateAccessToken(user); // tạo access token
                const refreshToken = authController.generateRefreshToken(user); // tạo refresh token
                res.cookie("refreshToken", refreshToken, { //arg1 là tên cookie, arg2 là giá trị cookie, arg3 là option
                    httpOnly: true, // không cho client-side javascript truy cập cookie
                    secure: false,  // chỉ gửi cookie qua https
                    path: '/', // chỉ gửi cookie cho các request có path là '/'
                    sameSide: "strict" // chỉ gửi cookie nếu request đến từ cùng một domain
                }); // set refresh token vào cookie
                const { password, ...others } = user._doc; // loại bỏ password trong object user
                res.status(200).json({...others, accessToken}); // trả về thông tin user không có password và token
            }
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    //refresh token(bao gồm accessToken và refreshToken)
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken; // lấy refresh token từ cookie
        if(!refreshToken) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if(!refreshTokens.includes(refreshToken)) { // kiểm tra refresh token có trong mảng refreshTokens không
            return res.status(403).json({ message: 'Invalid token' });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => { // verify refresh token
            if(err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            refreshTokens = refreshTokens.filter(token => token !== refreshToken); // loại bỏ refresh token khỏi mảng refreshTokens
            //create new access token, new refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken); // thêm refresh token mới vào mảng refresh
            res.cookie("refreshToken", newRefreshToken, { // set new refresh token vào cookie
                httpOnly: true,
                secure: true,
                path: '/',
                sameSide: "strict"
            });
            res.status(200).json({accessToken: newAccessToken});
        });
    },
    //logout
    logoutUser: async (req, res) => {
        //clear cookie when logout
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken); // loại bỏ refresh token khỏi mảng refreshTokens
        res.clearCookie("refreshToken"); // xóa cookie  có value là "refreshToken"
        res.status(200).json({ message: 'Logged out' });
    },
}

module.exports = authController;


//Tóm tắt lại : access token dùng để gắn vào phần header để verify user, refresh token dùng để tạo access token mới khi access token hết hạn. Nếu access token hết hạn mà không chịu refresh thì người dùng phải đăng nhập lại để lấy accesstoken mới.