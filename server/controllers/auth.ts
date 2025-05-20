import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import BadRequestError from '../errors/bad-request.js'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  })

  res.status(200).json(token)
}
