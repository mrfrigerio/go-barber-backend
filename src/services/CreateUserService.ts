import { getRepository } from 'typeorm'
import User from '../models/User'
import AppError from '../error/AppError'

interface Request {
  name: string
  email: string
  password: string
}

export default class CreateUserService {
  async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User)
    const checkUserExists = await userRepository.findOne({ email })
    if (checkUserExists) {
      throw new AppError('User already exists!')
    }
    const user = userRepository.create({ name, email })
    user.password = password

    await userRepository.save(user)
    return user
  }
}
