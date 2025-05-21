import { Response, NextFunction } from 'express'
import UnauthenticatedError from '../errors/unauthenticated.js'
import { isTokenValid } from '../utils/jwt.js'

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token

  if (!token) {
    console.log('token')
    throw new UnauthenticatedError('Authentication Invalid')
  }

  try {
    req.user = isTokenValid(token) as any
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

export default authMiddleware
