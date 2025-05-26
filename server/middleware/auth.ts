import { Response, NextFunction } from 'express'
import { isTokenValid } from '../utils/auth.js'
import APIError from '../utils/api-error.js'

export const authentication = async (req: any, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token

  if (!token) {
    console.log('token')
    throw new APIError('Authentication Invalid', 401)
  }

  try {
    req.user = isTokenValid(token) as any
    next()
  } catch (error) {
    throw new APIError('Authentication Invalid', 401)
  }
}

export const authorization = (...roles: any[]): any => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new APIError('Unauthorized to access this route', 401)
    }
    next()
  }
}
