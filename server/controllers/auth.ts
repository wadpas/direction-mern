import { Request, Response, NextFunction } from 'express'
import CustomAPIError from '../errors/custom-error.js'

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new CustomAPIError('Please provide email and password', 400)
  }

  res.status(200).json({ username, password })
}
