import { Router } from 'express'
import CreateSessionService from '../services/CreateSessionService'

const sessionsRouter = Router()

sessionsRouter.post('/', async (req, res) => {
  const createSessionService = new CreateSessionService()
  const { email, password } = req.body
  const user = await createSessionService.execute({ email, password })
  return res.json(user)
})

export default sessionsRouter
