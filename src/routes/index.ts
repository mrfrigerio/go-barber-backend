import { Router } from 'express'

import appointmentsRouter from './appointments.routes'
import usersRouter from './users.routes'
import sessionsRouter from './sessions.routes'
import authMiddleware from '../middlewares/auth'

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

// Middlewares
routes.use(authMiddleware)

// Authenticated routes
routes.use('/appointments', appointmentsRouter)

export default routes
