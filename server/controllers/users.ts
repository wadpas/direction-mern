import { Request, Response } from 'express'
import User from '../models/user.js'
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'
import { attachCookiesToResponse, createTokenUser, checkPermissions } from '../utils/auth.js'

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(200).json({ users })
}

export const getUser = async (req: any, res: Response): Promise<any> => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id ${req.params.id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(200).json({ user })
}

export const getCurrentUser = async (req: any, res: Response): Promise<any> => {
  res.status(200).json({ user: req.user })
}

export const updateUser = async (req: any, res: Response): Promise<any> => {
  const { email, name } = req.body
  if (!email || !name) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  if (!user) {
    throw new NotFoundError(`No user with id ${req.user.userId}`)
  }

  user.email = email
  user.name = name

  await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(200).json(tokenUser)
}

export const updateUserPassword = async (req: any, res: Response): Promise<any> => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values')
  }

  const user = await User.findOne({ _id: req.user.userId })

  if (!user) {
    throw new NotFoundError(`No user with id ${req.user.userId}`)
  }

  //@ts-ignore
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  user.password = newPassword

  await user.save()
  res.status(200).json({ msg: 'Success! Password Updated.' })
}
