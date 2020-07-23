import {
  AbstractRepository,
  EntityRepository,
  Repository,
  getRepository
} from 'typeorm'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import User from '@modules/users/infra/typeorm/entities/User'

interface IRequest {
  date: Date
  provider: User
}

@EntityRepository(Appointment)
class AppointmentsRepository extends AbstractRepository<Appointment>
  implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    super()
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date
      }
    })
    return findAppointment
  }

  public async create({ date, provider }: IRequest): Promise<Appointment> {
    const appointment = this.ormRepository.create({ date, provider })
    await this.ormRepository.save(appointment)
    return appointment
  }
}

export default AppointmentsRepository
