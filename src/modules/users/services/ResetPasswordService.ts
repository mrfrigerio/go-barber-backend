import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'

interface IRequest {
  token: string
  password: string
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)
    if (!userToken) throw new AppError('Invalid User Token!')
    const { user } = userToken
    if (!user) throw new AppError('User not found!')
    user.password = password
    await this.usersRepository.save(user)
  }
}
