import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '@modules/users/infra/typeorm/entities/User'
import { v4 } from 'uuid'

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  async create({
    email,
    name,
    password,
    password_hash
  }: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, {
      id: v4(),
      name,
      email,
      password,
      password_hash
    })

    this.users.push(user)
    return user
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id)
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(u => u.email === email)
    return user
  }

  async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(u => u.id === user.id)
    if (findIndex) this.users[findIndex] = user
    return user
  }
}
