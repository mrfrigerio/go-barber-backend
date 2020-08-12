import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({ name, email, password }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)
    if (checkUserExists) {
      throw new AppError('User already exists!')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)
    const user = await this.usersRepository.create({
      name,
      email,
      password,
      password_hash: hashedPassword
    })
    return user
  }
}
