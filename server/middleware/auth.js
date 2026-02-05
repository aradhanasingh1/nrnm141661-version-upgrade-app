const { verify } = require('../services/jwt')

module.exports = function (req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    req.user = verify(token)
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
