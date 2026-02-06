// 

const { verify } = require('../services/jwt');

module.exports = function (req, res, next) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Unauthorized: No token' });
    }
    return res.redirect('/index');
  }

  try {
    const decoded = verify(token);
    
    req.user = decoded;
    
    next();
  } catch (err) {
    res.clearCookie('token');
    
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.redirect('/index');
  }
};