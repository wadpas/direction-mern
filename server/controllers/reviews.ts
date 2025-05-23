import { Request, Response } from 'express'
import Product from '../models/product.js'
import Review from '../models/review.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import { checkPermissions } from '../utils/auth.js'

export const getReviews = async (req: any, res: Response): Promise<any> => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })

  res.status(200).json({ reviews, count: reviews.length })
}

export const getReview = async (req: Request, res: Response): Promise<any> => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`)
  }

  res.status(200).json({ review })
}

export const createReview = async (req: any, res: Response): Promise<any> => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id : ${productId}`)
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (alreadySubmitted) {
    throw new BadRequestError('Already submitted review for this product')
  }

  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(201).json({ review })
}

export const updateReview = async (req: any, res: Response): Promise<any> => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`)
  }

  checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()
  res.status(200).json({ review })
}

export const deleteReview = async (req: any, res: Response): Promise<any> => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`)
  }

  checkPermissions(req.user, review.user)
  await review.deleteOne()
  res.status(200).json({ msg: 'Success! Review removed' })
}
