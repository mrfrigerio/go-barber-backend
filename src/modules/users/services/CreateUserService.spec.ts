import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'

let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    createUser = new CreateUserService(
      new FakeUsersRepository(),
      new FakeHashProvider()
    )
  })
  it('Shold be able to create a new User', async () => {
    const user = await createUser.execute({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })
    expect(user).toBeInstanceOf(User)
  })

  it('Shold not be able to to create more than one user with same email', async () => {
    await createUser.execute({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123abc'
    })
    await expect(
      createUser.execute({
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123abc'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
