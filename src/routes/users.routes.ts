import { Router } from 'express'
import multer from 'multer'
import CreateUserService from '../services/CreateUserService'
import authMiddleware from '../middlewares/auth'
import multerConfig from '../config/multer'
import UpdateAvatarService from '../services/UpdateAvatarService'

const usersRouter = Router()
const upload = multer(multerConfig)

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body
  const createUserService = new CreateUserService()
  const user = await createUserService.execute({ name, email, password })
  return res.json(user)
})

usersRouter.patch(
  '/',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    const updateAvatarService = new UpdateAvatarService()
    const user = await updateAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename
    })
    return res.json(user)
  }
)

export default usersRouter
