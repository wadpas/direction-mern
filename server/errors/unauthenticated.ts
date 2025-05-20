import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-error.js'

export default class UnauthenticatedError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}
