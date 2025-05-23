import express from 'express'
import { authentication } from '../middleware/auth.js'

import { getReviews, createReview, getReview, updateReview, deleteReview } from '../controllers/reviews.js'

const router = express.Router()

router.route('/').get(getReviews).post(authentication, createReview)

router.route('/:id').get(getReview).patch(authentication, updateReview).delete(authentication, deleteReview)

export default router
