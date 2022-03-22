import { AppError } from '../../../shared/errors/AppError'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { CreateUserService } from './CreateUserService'
import { DeleteUserService } from './DeleteUserService'

let fakeUsersRepository: FakeUsersRepository
let createUserService: CreateUserService
let deleteUserService: DeleteUserService

describe('User delete', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		createUserService = new CreateUserService(fakeUsersRepository)
		deleteUserService = new DeleteUserService(fakeUsersRepository)
	})

	it('Should be able to delete an user', async () => {
		const user = await createUserService.execute({
			name: 'João Paulo',
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const spyDelete = jest.spyOn(fakeUsersRepository, 'delete')

		await deleteUserService.execute({ id: user.id })

		expect(spyDelete).toBeCalledWith(user)
		expect(spyDelete).toBeCalledTimes(1)
	})

	it('Should not be able to delete a nonexistent user', async () => {
		expect(async () => {
			await deleteUserService.execute({
				id: '1234'
			})
		}).rejects.toBeInstanceOf(AppError)
	})
})