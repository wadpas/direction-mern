import 'express-async-errors'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db/connect.js'
import products from './routes/products.js'
import auth from './routes/auth.js'
import notFound from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'

dotenv.config()
const app = express()

// middleware
app.use(express.json())
app.use(cors())

// routes
app.use('/api/products', products)
app.use('/api/auth', auth)
app.use(notFound)
app.use(errorHandler as any)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
