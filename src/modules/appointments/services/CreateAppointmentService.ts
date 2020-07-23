import { startOfHour } from 'date-fns'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import { injectable, inject } from 'tsyringe'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    provider_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date) // regra de negócio
    const ocuppiedDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (ocuppiedDate) {
      throw new AppError('This date/time is not available!', 401)
    }
    const provider = await this.usersRepository.findById(provider_id)
    if (!provider) {
      throw new AppError('Provider does not exists!', 401)
    }
    const appointment = await this.appointmentsRepository.create({
      provider,
      date: appointmentDate
    })

    return appointment
  }
}

export default CreateAppointmentService
