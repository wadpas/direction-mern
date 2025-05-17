import { Request, Response, NextFunction } from 'express'

const errorHandlerMiddleware = async (err: any, req: Request, res: Response, next: NextFunction): Promise<any> => {
  console.log(err)
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

export default errorHandlerMiddleware
