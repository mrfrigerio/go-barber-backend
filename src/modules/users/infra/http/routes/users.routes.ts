import { Router } from 'express'
import multer from 'multer'
import authMiddleware from '@modules/users/infra/http/middlewares/auth'
import multerConfig from '@config/multer'
import UsersController from '../controllers/UsersController'
import UsersAvatarController from '../controllers/UsersAvatarController'

const usersRouter = Router()
const upload = multer(multerConfig)

usersRouter.post('/', UsersController.create)

usersRouter.patch(
  '/',
  authMiddleware,
  upload.single('avatar'),
  UsersAvatarController.update
)

export default usersRouter
