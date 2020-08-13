import { v4 } from 'uuid'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IUserRepository from '@modules/users/repositories/IUsersRepository'
import UserToken from '@modules/users/infra/typeorm/entities/UserToken'
import FakeUsersRepository from './FakeUsersRepository'

@injectable()
export default class FakeUserTokensRepository implements IUserTokensRepository {
  private user_tokens: UserToken[] = []

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository
  ) {}

  private fakeUsersRepository = new FakeUsersRepository()

  async generate(user_id: string): Promise<UserToken> {
    const userExists = await this.usersRepository.findById(user_id)
    if (!userExists) {
      throw new AppError('User does not exists!')
    }

    const userToken = new UserToken()
    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user: userExists,
      created_at: new Date(),
      updated_at: new Date()
    })

    this.user_tokens.push(userToken)

    return userToken
  }
}
