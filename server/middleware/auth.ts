import { Response, NextFunction } from 'express'
import { UnauthorizedError, UnauthenticatedError } from '../errors/index.js'
import { isTokenValid } from '../utils/auth.js'

export const authentication = async (req: any, res: Response, next: NextFunction) => {
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

export const authorization = (...roles: any[]): any => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}
