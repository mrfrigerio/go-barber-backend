import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import User from '@modules/users/infra/typeorm/entities/User'

interface ICreateAppointmentData {
  provider: User
  date: Date
}

export default interface IAppointmentsRepository {
  create: (data: ICreateAppointmentData) => Promise<Appointment>
  findByDate: (date: Date) => Promise<Appointment | undefined>
}
