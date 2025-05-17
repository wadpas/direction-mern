import { Request, Response } from 'express'

const notFound = async (req: Request, res: Response): Promise<any> => {
  res.status(404).send('Route does not exist')
}

export default notFound
