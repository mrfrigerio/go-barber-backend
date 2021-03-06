import { container } from 'tsyringe'
import { Request, Response } from 'express'
import CreateUserService from '@modules/users/services/CreateUserService'

class UsersController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body
    const createUserService = container.resolve(CreateUserService)
    const user = await createUserService.execute({ name, email, password })
    return res.json(user)
  }
}

export default new UsersController()
