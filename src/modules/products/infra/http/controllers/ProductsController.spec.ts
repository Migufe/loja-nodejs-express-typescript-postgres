import request from 'supertest'
import { app } from '../../../../../shared/infra/http/app'
import { hash } from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { DataSource } from 'typeorm'
import { TestDataSource } from '../../../../../shared/infra/typeorm'

let connection: DataSource

describe('Products Controller Test', () => {
	beforeAll(async () => {
		connection = await TestDataSource.initialize()
		await connection.runMigrations()

		const id = uuid()
		const password = await hash('admin', 8)

		await connection.query(`
    INSERT INTO USERS(id, created_at, updated_at, name, email, password, "isAdmin")
    values('${id}', 'now()', 'now()', 'JP_Admin', 'admin@migufes.com.br', '${password}', 'true')
  `)
	})

	afterAll(async () => {
		await connection.dropDatabase()
		await connection.destroy()
	})

	it('Should be able to create a product if user is an admin', async () => {
		const responseToken = await request(app).post('/session').send({
			email: 'admin@migufes.com.br',
			password: 'admin'
		})

		const { token } = responseToken.body

		const response = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		expect(response.status).toBe(201)
	})

	it('Should not be able to create a product if user is not an admin', async () => {
		await request(app).post('/users').send({
			name: 'João Paulo',
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const responseToken = await request(app).post('/session').send({
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const { token } = responseToken.body

		const response = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		expect(response.status).toBe(400)
	})

	it('Should be able to update an existent product if user is an admin', async () => {
		const responseToken = await request(app).post('/session').send({
			email: 'admin@migufes.com.br',
			password: 'admin'
		})

		const { token } = responseToken.body

		const responseCreate = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		const product_id = await responseCreate.body.id

		// eslint-disable-next-line quotes
		const response = await request(app).put(`/products/${product_id}`).send({
			name: 'Biscoito',
			description: 'Sabor chocolate',
			price: 4
		}).set({
			Authorization: `Bearer ${token}`
		})


		expect(response.status).toBe(200)
	})

	it('Should not be able to update a product if user is not an admin', async () => {
		await request(app).post('/users').send({
			name: 'João Paulo',
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const responseToken = await request(app).post('/session').send({
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const { token } = responseToken.body

		const responseCreate = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		const product_id = await responseCreate.body.id

		// eslint-disable-next-line quotes
		const response = await request(app).put(`/products/${product_id}`).send({
			name: 'Biscoito',
			description: 'Sabor chocolate',
			price: 4
		}).set({
			Authorization: `Bearer ${token}`
		})


		expect(response.status).toBe(400)
	})

	it('Should be able to delete an existent product if user is an admin', async () => {
		const responseToken = await request(app).post('/session').send({
			email: 'admin@migufes.com.br',
			password: 'admin'
		})

		const { token } = responseToken.body

		const responseCreate = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		const product_id = await responseCreate.body.id

		const response = await request(app).delete(`/products/delete/${product_id}`)
			.set({
				Authorization: `Bearer ${token}`
			})

		expect(response.status).toBe(202)
	})

	it('Should not be able to delete a product if user is not an admin', async () => {
		await request(app).post('/users').send({
			name: 'João Paulo',
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const responseToken = await request(app).post('/session').send({
			email: 'joaopaulo@gmail.com',
			password: '1234'
		})

		const { token } = responseToken.body

		const responseCreate = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		const product_id = await responseCreate.body.id

		const response = await request(app).delete(`/products/delete/${product_id}`)
			.set({
				Authorization: `Bearer ${token}`
			})

		expect(response.status).toBe(400)
	})

	it('Should be able to list products if user is an admin', async () => {
		const responseToken = await request(app).post('/session').send({
			email: 'admin@migufes.com.br',
			password: 'admin'
		})

		const { token } = responseToken.body

		const responseCreate = await request(app).post('/products').send({
			name: 'Biscoito',
			description: 'Sabor morango',
			price: 3
		}).set({
			Authorization: `Bearer ${token}`
		})

		const response = await request(app).get('/products').send({
			name: 'Biscoito'
		})

		expect(response.status).toBe(200)
		expect(response.body.length).toEqual(10)
	})
})