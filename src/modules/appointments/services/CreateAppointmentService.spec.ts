import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository'
import FakeAppointmensRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

let createAppointment: CreateAppointmentService
let fakeAppointmentRepository: FakeAppointmensRepository
let fakeUsersRepository: FakeUsersRepository
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmensRepository()
    fakeUsersRepository = new FakeUsersRepository()
    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeUsersRepository
    )
  })
  it('Shold be able to create a new appointment', async () => {
    const user = await fakeUsersRepository.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    const appointment = await createAppointment.execute({
      provider_id: user.id,
      date: new Date(2020, 4, 10, 11)
    })
    expect(appointment).toBeInstanceOf(Appointment)
  })

  it('Shold not be able to to create more than one appointment on an already booked date/time', async () => {
    const user = await fakeUsersRepository.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })
    await createAppointment.execute({
      provider_id: user.id,
      date: new Date(2020, 4, 10, 12)
    })
    expect(
      createAppointment.execute({
        provider_id: user.id,
        date: new Date(2020, 4, 10, 12)
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Shold not be able to create an appointment with inexistent provider', async () => {
    expect(
      createAppointment.execute({
        provider_id: 'non-existent-provider',
        date: new Date()
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
