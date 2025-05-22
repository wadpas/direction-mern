import express from 'express'
import { authentication, authorization } from '../middleware/auth.js'

import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../controllers/products.js'

const router = express.Router()

router.route('/').get(getProducts).post(authentication, authorization('admin'), createProduct)

router.route('/upload-image').post(authentication, authorization('admin'), uploadImage)

router
  .route('/:id')
  .get(getProduct)
  .patch(authentication, authorization('admin'), updateProduct)
  .delete(authentication, authorization('admin'), deleteProduct)

export default router
