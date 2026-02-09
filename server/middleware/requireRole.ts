import { Response, NextFunction } from 'express'

export default function requireRole(...roles: string[]) {
  return function (req: any, res: Response, next: NextFunction) {
    const role = req.user?.role

    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}
