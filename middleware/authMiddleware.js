const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

module.exports = authMiddleware;
