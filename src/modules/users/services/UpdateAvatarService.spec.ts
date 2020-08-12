import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'
import UpdateAvatarService from './UpdateAvatarService'

interface IRequest {
  user_id: string
  avatarFilename: string
}

describe('UpdateAvatarService', () => {
  const usersRepository = new FakeUsersRepository()
  const storageProvider = new FakeStorageProvider()
  const createUser = new CreateUserService(
    new FakeUsersRepository(),
    new FakeHashProvider()
  )
  const updateAvatarService = new UpdateAvatarService(
    usersRepository,
    storageProvider
  )

  it('Shold be able to change the User Avatar', async () => {
    const user = await createUser.execute({
      email: 'user@fake.com',
      name: 'John Doe',
      password: '123abc'
    })

    if (user.avatar) {
      // Deletar avatar anterior do repositório de arquivos
      await storageProvider.deleteFile(user.avatar)
    }

    const updatedUser = await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'myFakeAvatar.png'
    })

    expect(updatedUser.avatar).toBe('myFakeAvatar.png')
  })

  it('Shold delete previous User Avatar', async () => {
    const user = await createUser.execute({
      email: 'other@fake.com',
      name: 'John Other',
      password: '123abc'
    })

    if (user.avatar) {
      // Deletar avatar anterior do repositório de arquivos
      await storageProvider.deleteFile(user.avatar)
    }

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'myFakeAvatar.png'
    })

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile')
    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'myChangedFakeAvatar.png'
    })

    expect(deleteFile).toHaveBeenCalledWith('myFakeAvatar.png')
    expect(user.avatar).toBe('myChangedFakeAvatar.png')
  })

  it('Shold not be able to change the User Avatar of an inexistent User', async () => {
    expect(
      updateAvatarService.execute({
        user_id: 'non-existent-user',
        avatarFilename: 'myFakeAvatar.png'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
