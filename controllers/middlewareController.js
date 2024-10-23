const jwt = require('jsonwebtoken');

const middlewareController = {
      // Middleware to check if the user is authenticated
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.username) {
      return next();
    } else {
      res.redirect('/auth/login');
    }
  },
}

module.exports = middlewareController;