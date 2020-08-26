// import User from '@modules/users/infra/typeorm/entities/User'
// import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository(fakeUsersRepository)

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository
    )
  })

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    resetPassword.execute({ password: '123123', token })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(updatedUser?.password).toBe('123123')
  })
})

// Hash
// 2h expiração
// userToken inexistente
// user inexistente
