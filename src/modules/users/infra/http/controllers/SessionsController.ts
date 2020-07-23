import { container } from 'tsyringe'
import { Request, Response } from 'express'
import CreateSessionService from '@modules/users/services/CreateSessionService'

class SessionsController {
  async create(req: Request, res: Response): Promise<Response> {
    const createSessionService = container.resolve(CreateSessionService)
    const { email, password } = req.body
    const user = await createSessionService.execute({ email, password })
    return res.json(user)
  }
}

export default new SessionsController()
