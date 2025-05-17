import { Request, Response } from 'express'

import Product from '../models/product.js'

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.find({})
    res.status(200).json({ products })
  } catch (error) {
    res.status(500).json({ error })
  }
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
