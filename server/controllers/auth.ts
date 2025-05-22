import { Request, Response } from 'express'
import User from '../models/user.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse } from '../utils/auth.js'

export const register = async (req: Request, res: Response) => {
  const user = await User.create(req.body)
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(201).json({ tokenUser })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  //@ts-ignore
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(200).json({ user: tokenUser })
}

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(200).json({ msg: 'user logged out!' })
}
