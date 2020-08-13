// import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository(fakeUsersRepository)
    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    )
  })

  it('Shold be able to retrieve the password using the email', async () => {
    const sendMailFunc = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    await sendForgotPasswordEmail.execute({
      email: 'john@doe.com'
    })

    expect(sendMailFunc).toHaveBeenCalled()
  })

  it('Should not be able to retrieve password using an inexistent email', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'john@doe.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Shold generate a forgot password token', async () => {
    const user = await fakeUsersRepository.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    const generateTokenFunc = jest.spyOn(fakeUserTokensRepository, 'generate')

    await sendForgotPasswordEmail.execute({
      email: 'john@doe.com'
    })

    expect(generateTokenFunc).toHaveBeenCalledWith(user.id)
  })
})
