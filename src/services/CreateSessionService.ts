import jwt from 'jsonwebtoken'
import User from '../models/User'
import CheckUserPasswordService from './CheckUserPasswordService'
import authConfig from '../config/auth'

interface Request {
  email: string
  password: string
}
export default class CreateSessionRepository {
  async execute({
    email,
    password
  }: Request): Promise<{ user: User; token: string }> {
    const checkUserPasswordService = new CheckUserPasswordService()
    const user = await checkUserPasswordService.execute({ email, password })

    return {
      user,
      token: jwt.sign({}, authConfig.jwt.secret, {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn
      })
    }
  }
}
