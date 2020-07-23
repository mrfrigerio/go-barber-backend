import path from 'path'
import fs from 'fs'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import uploadConfig from '@config/multer'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  user_id: string
  avatarFilename: string
}
@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found!', 401)
    }

    if (user.avatar) {
      // Deletar avatar anterior do repositório de arquivos
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = fs.existsSync(userAvatarFilePath)
      if (userAvatarFileExists) {
        fs.unlinkSync(userAvatarFilePath)
      }
    }

    user.avatar = avatarFilename
    await this.usersRepository.save(user)

    return user
  }
}
