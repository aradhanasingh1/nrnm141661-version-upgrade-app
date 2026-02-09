import { Response, NextFunction } from "express"
import { verify } from "../services/jwt"

export default function auth(req: any, res: Response, next: NextFunction) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    req.user = verify(token)
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
