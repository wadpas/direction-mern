import { Request, Response } from 'express'
import Product from '../models/product.js'
import Review from '../models/review.js'
import { checkPermissions } from '../utils/auth.js'
import APIError from '../utils/api-error.js'

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
    throw new APIError(`No review with id ${reviewId}`, 404)
  }

  res.status(200).json({ review })
}

export const createReview = async (req: any, res: Response): Promise<any> => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new APIError(`No product with id : ${productId}`, 404)
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (alreadySubmitted) {
    throw new APIError('Already submitted review for this product', 400)
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
    throw new APIError(`No review with id ${reviewId}`, 404)
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
    throw new APIError(`No review with id ${reviewId}`, 404)
  }

  checkPermissions(req.user, review.user)
  await review.deleteOne()
  res.status(200).json({ msg: 'Success! Review removed' })
}
