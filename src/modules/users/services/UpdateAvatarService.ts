import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

interface IRequest {
  user_id: string
  avatarFilename: string
}
@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)
    if (!user) {
      throw new AppError('User not found!', 401)
    }

    if (user.avatar) {
      // Deletar avatar anterior do repositório de arquivos
      await this.storageProvider.deleteFile(user.avatar)
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename)
    user.avatar = fileName

    await this.usersRepository.save(user)

    return user
  }
}
