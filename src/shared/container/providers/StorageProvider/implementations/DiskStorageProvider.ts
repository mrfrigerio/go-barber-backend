import fs from 'promise-fs'
import path from 'path'
import uploadConfig from '@config/multer'
import IStorageProvider from '../models/IStorageProvider'

export default class DiskStorageProvider implements IStorageProvider {
  async saveFile(file: string): Promise<string> {
    fs.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file)
    )
    return file
  }

  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file)

    try {
      await fs.stat(filePath)
    } catch {
      return
    }
    await fs.unlink(filePath)
  }
}
