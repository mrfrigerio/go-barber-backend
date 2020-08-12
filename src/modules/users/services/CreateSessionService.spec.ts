import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import CreateSessionService from './CreateSessionService'
import CreateUserService from './CreateUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

describe('CreateSessionService', () => {
  const fakeUsersRepository = new FakeUsersRepository()
  const createUserService = new CreateUserService(
    fakeUsersRepository,
    new FakeHashProvider()
  )
  const createSessionService = new CreateSessionService(fakeUsersRepository)

  it('Should be able to create a session (Authenticate)', async () => {
    /**
     * 1. Create a user;
     * 2. Create a session with this user.
     */

    const name = 'John Doe'
    const email = 'john.doe@user.com'
    const password = '123abc'

    const newUser = await createUserService.execute({
      name,
      email,
      password
    })

    const response = await createSessionService.execute({
      email,
      password
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(newUser)
  })

  it('Should not be able to create a session (Authenticate) with an inexistent user', async () => {
    expect(
      createSessionService.execute({
        email: 'mary.doe@user.com',
        password: '123abc'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a session (Authenticate) with wrong password', async () => {
    const name = 'Mary Doe'
    const email = 'mary.doe@user.com'
    const password = '123abc'

    await createUserService.execute({
      name,
      email,
      password
    })

    expect(
      createSessionService.execute({
        email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
