import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

interface IRequest {
  email: string
  password: string
}

@injectable()
export default class CheckUserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User not found!', 401)
    }
    const isValidPassword = await this.hashProvider.compareHash(
      password,
      user.password_hash
    )
    if (!isValidPassword) {
      throw new AppError('Invalid user password!', 401)
    }
    return user
  }
}
