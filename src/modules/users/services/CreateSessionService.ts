import jwt from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'
import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'
import CheckUserPasswordService from '@modules/users/services/CheckUserPasswordService'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

@injectable()
export default class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    email,
    password
  }: IRequest): Promise<{ user: User; token: string }> {
    const checkUserPasswordService = new CheckUserPasswordService(
      this.usersRepository
    )
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
