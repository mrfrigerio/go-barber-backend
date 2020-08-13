import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import User from '@modules/users/infra/typeorm/entities/User'
import { v4 } from 'uuid'
import { isEqual } from 'date-fns'

interface IRequest {
  date: Date
  provider: User
}

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = []

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(a => isEqual(a.date, date))
    return appointment
  }

  public async create({ date, provider }: IRequest): Promise<Appointment> {
    const appointment = new Appointment()
    Object.assign(appointment, {
      id: v4(),
      date,
      provider,
      created_at: new Date(),
      updated_at: new Date()
    })
    this.appointments.push(appointment)
    return appointment
  }
}

export default AppointmentsRepository
