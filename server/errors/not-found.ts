import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-error.js'

export default class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}
