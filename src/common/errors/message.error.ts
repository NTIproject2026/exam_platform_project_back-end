import appError from './app.error.js'

export function BadRequestException(
  message: string = 'Bad user Request',
  statusCode: number = 400,
) {
  throw new appError(message, statusCode)
}
export function UnAuthorizedException(
  message: string = 'unAuthorized Request',
  statusCode: number = 401,
) {
  throw new appError(message, statusCode)
}
export function ForbiddenException(
  message: string = 'forbidden Request',
  statusCode: number = 403,
) {
  throw new appError(message, statusCode)
}
export function NotFoundException(
  message: string = 'not found',
  statusCode: number = 404,
) {
  throw new appError(message, statusCode)
}
export function InternalSererErrorException(
  message: string = 'Internal serer error',
  statusCode: number = 500,
) {
  throw new appError(message, statusCode)
}
