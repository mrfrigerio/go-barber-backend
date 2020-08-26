import { startOfHour } from 'date-fns'
import { getCustomRepository, getRepository } from 'typeorm'
import AppError from '../error/AppError'
import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentRepository'
import User from '../models/User'

interface RequestDTO {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointmentDate = startOfHour(date) // regra de negócio
    const ocuppiedDate = await appointmentsRepository.findByDate(
      appointmentDate
    )

    if (ocuppiedDate) {
      throw new AppError('This date/time is not available!', 401)
    }
    const userRepository = getRepository(User)
    const provider = await userRepository.findOne({ id: provider_id })
    if (!provider) {
      throw new AppError('Provider does not exists!', 401)
    }
    const appointment = appointmentsRepository.create({
      date,
      provider
    })

    await appointmentsRepository.save(appointment)
    return appointment
  }
}

export default CreateAppointmentService
