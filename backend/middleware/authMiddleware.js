const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).send('Access denied');
    }
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).send('Access forbidden: insufficient permissions');
      }

      next();
    } catch (err) {
      res.status(400).send('Invalid token');
    }
  };
};

module.exports = authMiddleware;
