import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'
import User from '../models/User'
import uploadConfig from '../config/multer'
import AppError from '../error/AppError'

interface Request {
  user_id: string
  avatarFilename: string
}

export default class UpdateAvatarService {
  async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User)
    const user = await userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user_id })
      .getOne()

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
    await userRepository.save(user)

    return user
  }
}
