import 'express-async-errors'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db/connect.js'
import auth from './routes/auth.js'
import products from './routes/products.js'
import users from './routes/users.js'
import notFound from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

dotenv.config()
const app = express()

// middleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser('cookieParser'))
app.use(cors())
app.use(express.static('./public'))
app.use(fileUpload())

// routes
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/products', products)
app.use(notFound)
app.use(errorHandler as any)

const port = process.env.PORT || 5000
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
