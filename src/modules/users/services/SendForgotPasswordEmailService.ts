import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
// import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

interface IRequest {
  email: string
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email)
    if (!userExists) {
      throw new AppError('User does not exists.', 401)
    }

    const user_token = await this.userTokensRepository.generate(userExists.id)

    this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha recebido!\nURL: http://gobarber.com/password_recover/${user_token.token}`
    )
  }
}
