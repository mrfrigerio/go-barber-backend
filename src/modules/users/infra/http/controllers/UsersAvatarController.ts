import { container } from 'tsyringe'
import { Request, Response } from 'express'
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService'

class UsersController {
  async update(req: Request, res: Response): Promise<Response> {
    const updateAvatarService = container.resolve(UpdateAvatarService)
    const user = await updateAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename
    })
    return res.json(user)
  }
}

export default new UsersController()
