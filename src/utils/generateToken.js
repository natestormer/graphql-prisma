import jwt from "jsonwebtoken"

const AUTH_SECRET = "thisisasecret"
const TOKEN_EXPIRATION = "7 days"

const generateToken = userId =>
  jwt.sign({ userId }, AUTH_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  })

export { generateToken as default }
