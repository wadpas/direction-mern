import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import UnauthenticatedError from '../errors/unauthenticated.js'

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    const { email } = decoded as { email: string }
    req.user = { email }
    console.log(req.user)

    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

export default authMiddleware
