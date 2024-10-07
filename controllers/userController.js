const User = require('../models/user');

const userController = {
    //get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    //delete user by id
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id); //tạm chuyển từ findbyIdAndDelete sang findById
            if(!user) {
                res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted' });
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = userController;