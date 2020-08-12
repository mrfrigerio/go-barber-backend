import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '@modules/users/infra/typeorm/entities/User'

export default class FakeUsersRepository implements IUsersRepository {
  private static users: User[] = [
    Object.assign(new User(), {
      id: '0',
      name: 'Fake User',
      email: 'fake@fake.com'
    })
  ]

  private static idSequence = 0

  private getIdSequence = (): string => {
    FakeUsersRepository.idSequence += 1
    return FakeUsersRepository.idSequence.toString()
  }

  async create({
    email,
    name,
    password,
    password_hash
  }: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, {
      id: this.getIdSequence(),
      name,
      email,
      password,
      password_hash
    })
    FakeUsersRepository.users.push(user)
    return user
  }

  async findById(id: string): Promise<User | undefined> {
    const user = FakeUsersRepository.users.find(u => u.id === id)
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = FakeUsersRepository.users.find(u => u.email === email)
    return user
  }

  async save(user: User): Promise<User> {
    const findIndex = FakeUsersRepository.users.findIndex(u => u.id === user.id)
    if (findIndex) FakeUsersRepository.users[findIndex] = user
    return user
  }
}
