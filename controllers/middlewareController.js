const jwt = require('jsonwebtoken');

const middlewareController = {
    //middleware to verify token
    // verifyToken: (req, res, next) => {
    //     const token = req.headers.token; // Lấy giá trị của token từ phần headers của yêu cầu HTTP. req.headers chứa tất cả các tiêu đề HTTP đi kèm với yêu cầu.
    //     if(token) {
    //         const accessToken = token.split(' ')[1]; // Tách token từ bearer token
    //         jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => { //user là payload của token đã được giải mã
    //             if(err) {
    //                 return res.status(403).json({ message: 'Invalid token' });
    //             }
    //             req.user = user; //lưu thông tin user vào req.user
    //             next(); //chuyển hướng yêu cầu sang middleware hoặc controller tiếp theo
    //         });
    //     } else {
    //         res.status(401).json({ message: 'you are not authenticated' });
    //     };
    // },
    verifyToken: (req,res, next) => {
        const token = req.cookies['accessToken'];
        if (!token) {
            res.locals.user = null;
            return next();
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            req.user = verified; //lưu thông tin user vào req.user
            res.locals.user = verified; 
            next();
        } catch (err) {
            res.locals.user = null;
            next();
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if( req.user.id == req.params.id || req.user.admin) { //nếu id của user trong token giống với id trong req hoặc user là admin
                next();
            } else {
                res.status(403).json({ message: 'You are not allowed' });
            }
        });
    }
}

module.exports = middlewareController;