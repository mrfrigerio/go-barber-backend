import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import CreateSessionService from './CreateSessionService'
import CreateUserService from './CreateUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let createUserService: CreateUserService
let createSessionService: CreateSessionService

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    createUserService = new CreateUserService(
      fakeUsersRepository,
      new FakeHashProvider()
    )
    createSessionService = new CreateSessionService(fakeUsersRepository)
  })

  it('Should be able to create a session (Authenticate)', async () => {
    const user = await createUserService.execute({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    const response = await createSessionService.execute({
      email: user.email,
      password: user.password
    })

    expect(response).toHaveProperty('token')

    expect(response.user).toEqual(user)
  })

  it('Should not be able to create a session (Authenticate) with an inexistent user', async () => {
    await expect(
      createSessionService.execute({
        email: 'john@doe.com',
        password: '123abc'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a session (Authenticate) with wrong password', async () => {
    const user = await createUserService.execute({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })

    await expect(
      createSessionService.execute({
        email: user.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
