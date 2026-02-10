import jwt from 'jsonwebtoken'

const JWT_SECRET = 'super_secret_key'

export const authorize = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.sendStatus(401)
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      if (!roles.includes(decoded.role)) {
        return res.sendStatus(403)
      }

      // attach user to request
      req.user = decoded
      next()
    } catch (err) {
      return res.sendStatus(401)
    }
  }
}
