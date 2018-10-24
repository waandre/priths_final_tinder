var isAuthenticated = function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
        next(new Error('you are not authenticated'));
    }
    
  }
  
  module.exports = isAuthenticated;