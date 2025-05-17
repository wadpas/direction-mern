import express from 'express'
import { getProducts, createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/products.js'

const router = express.Router()

router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct)

export default router
