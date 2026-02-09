import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "super-secret-key"

export function sign(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" })
}

export function verify(token: string): any {
  return jwt.verify(token, SECRET)
}
