import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util'
import authConfig from '../config/auth'
import AppError from '../error/AppError'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default async (
  req: Request,
  res: Response,
  nxt: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new AppError('JWT token is missing.', 401)
  }

  const [, token] = authorization.split(' ')
  try {
    const { sub } = (await promisify(jwt.verify)(
      token,
      authConfig.jwt.secret
    )) as TokenPayload
    req.user = { id: sub }

    return nxt()
  } catch (err) {
    throw new AppError('Invalid JWT token.', 401)
  }
}
