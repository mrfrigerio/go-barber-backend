import { Router } from 'express'
import AppointmentsController from '../controllers/AppointmentsController'

const appointmentsRouter = Router()

appointmentsRouter.post('/', AppointmentsController.create)

// appointmentsRouter.get('/', async (req, res) => {
//   // const appointments = await appointmentsRepository.find()
//   // return res.json(appointments)
// })

export default appointmentsRouter
