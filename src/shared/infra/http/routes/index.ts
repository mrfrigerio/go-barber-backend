import { Router } from 'express'

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import authMiddleware from '@modules/users/infra/http/middlewares/auth'

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

// Middlewares
routes.use(authMiddleware)

// Authenticated routes
routes.use('/appointments', appointmentsRouter)

export default routes
