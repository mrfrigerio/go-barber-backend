import multer from 'multer'
import { resolve, extname } from 'path'
import crypto from 'crypto'

const tmpFolder = resolve(__dirname, '..', '..', 'tmp')

export default {
  tmpFolder,
  uploadsFolder: resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return cb(err, '')
        return cb(
          null,
          `${buf.toString('hex')}_${new Date().getTime()}${extname(
            file.originalname
          )}`
        )
      })
    }
  })
}
