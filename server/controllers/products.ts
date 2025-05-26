import Product from '../models/product.js'
import { Request, Response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import APIError from '../utils/api-error.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  const { featured, company, name, sort, fields, numericFilters } = req.query

  interface queryObjectType {
    featured?: boolean
    company?: string
    name?: Object
    price?: Object
    rating?: Object
  }
  const queryObject: queryObjectType = {}

  if (featured) {
    queryObject.featured = featured as unknown as boolean
  }

  if (company) {
    queryObject.company = company as string
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g

    let filters = (numericFilters as string).replace(
      regEx,
      (match) => `-${operatorMap[match as keyof typeof operatorMap]}-`
    )

    const options = ['price', 'rating']
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        //@ts-ignore
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let results = Product.find(queryObject)

  if (sort) {
    const sortList = sort.toString().split(',').join(' ')
    results = results.sort(sortList)
  } else {
    results = results.sort('-createdAt')
  }

  if (fields) {
    const fieldsList = fields.toString().split(',').join(' ')
    results = results.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  results = results.skip(skip).limit(limit)
  const products = await results

  res.status(200).json({ products })
}

export const createProduct = async (req: any, res: Response): Promise<any> => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(201).json({ product })
}

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  const productId = req.params.id
  const product = await Product.findOne({ _id: productId }).populate('reviews')

  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` })
  }

  res.status(200).json({ product })
}

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  const productId = req.params.id
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` })
  }

  const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ product: updatedProduct })
}

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  const productId = req.params.id
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` })
  }

  await product.deleteOne()
  res.status(200).json({ product })
}

export const uploadImage = async (req: any, res: Response): Promise<any> => {
  if (!req.files) {
    throw new APIError('No File Uploaded', 400)
  }
  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new APIError('Please Upload Image', 400)
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new APIError('Please upload image smaller than 1MB', 400)
  }

  const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
  await productImage.mv(imagePath)
  res.status(200).json({ image: `/uploads/${productImage.name}` })
}
