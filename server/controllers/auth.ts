import { Request, Response } from 'express'
import { createTokenUser, attachCookiesToResponse } from '../utils/auth.js'
import User from '../models/user.js'
import APIError from '../utils/api-error.js'

export const register = async (req: Request, res: Response): Promise<any> => {
  const user = await User.create(req.body)
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(201).json({ tokenUser })
}

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new APIError('Please provide email and password', 400)
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new APIError('Invalid Credentials', 401)
  }

  //@ts-ignore
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new APIError('Invalid Credentials', 401)
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(200).json({ user: tokenUser })
}

export const logout = async (req: Request, res: Response): Promise<any> => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(200).json({ msg: 'user logged out!' })
}
