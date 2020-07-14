import { compare } from 'bcryptjs'
import { getRepository } from 'typeorm'
import User from '../models/User'
import AppError from '../error/AppError'

interface Request {
  email: string
  password: string
}

export default class CheckUserPasswordService {
  async execute({ email, password }: Request): Promise<User> {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ email })

    if (!user) {
      throw new AppError('User not found!', 401)
    }
    const isValidPassword = await compare(password, user.password_hash)
    if (!isValidPassword) {
      throw new AppError('Invalid user password!', 401)
    }
    return user
  }
}
