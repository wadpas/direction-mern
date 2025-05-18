import { Request, Response } from 'express'

import Product from '../models/product.js'

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

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ product })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = req.params.id
    const product = await Product.findOne({ _id: productId })

    if (!product) {
      return res.status(404).json({ error: `Product with id ${productId} not found` })
    }

    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
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
  } catch (error) {}
}

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = req.params.id
    const product = await Product.findOneAndDelete({ _id: productId })

    if (!product) {
      return res.status(404).json({ error: `Product with id ${productId} not found` })
    }

    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ error })
  }
}
