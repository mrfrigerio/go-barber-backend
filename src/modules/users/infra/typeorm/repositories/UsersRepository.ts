import {
  AbstractRepository,
  EntityRepository,
  getRepository,
  Repository
} from 'typeorm'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '@modules/users/infra/typeorm/entities/User'

@EntityRepository(User)
export default class UsersRepository extends AbstractRepository<User>
  implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    super()
    this.ormRepository = getRepository(User)
  }

  async create({ email, name, password }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ email, name })
    user.password = password
    await this.ormRepository.save(user)
    return user
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { id } })
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } })
    return user
  }

  async save(user: User): Promise<User> {
    await this.ormRepository.save(user)
    return user
  }
}
