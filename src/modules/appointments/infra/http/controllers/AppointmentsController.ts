import { parseISO } from 'date-fns'
import { container } from 'tsyringe'
import { Request, Response } from 'express'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

class AppointmentsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { provider_id, date } = req.body
    const parsedDate = parseISO(date)
    const createAppointmentService = container.resolve(CreateAppointmentService)
    const appointment = await createAppointmentService.execute({
      date: parsedDate,
      provider_id
    })
    return res.json(appointment)
  }
}

export default new AppointmentsController()
