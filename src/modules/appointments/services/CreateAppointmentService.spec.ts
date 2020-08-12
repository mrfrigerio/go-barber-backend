import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository'
import FakeAppointmensRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  const createAppointment = new CreateAppointmentService(
    new FakeAppointmensRepository(),
    new FakeUsersRepository()
  )
  it('Shold be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: '0',
      date: new Date(2020, 4, 10, 11)
    })
    expect(appointment).toBeInstanceOf(Appointment)
  })

  it('Shold not be able to to create more than one appointment on an already booked date/time', async () => {
    await createAppointment.execute({
      provider_id: '0',
      date: new Date(2020, 4, 10, 12)
    })
    expect(
      createAppointment.execute({
        provider_id: '0',
        date: new Date(2020, 4, 10, 12)
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Shold not be able to create an appointment with inexistent provider', async () => {
    expect(
      createAppointment.execute({
        provider_id: '999whatever',
        date: new Date()
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
