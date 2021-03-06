import { FakeProductsRepository } from '../repositories/fakes/FakeProductsRepository'
import { CreateProductsService } from './CreateProductService'
import { UpdateProductService } from './UpdateProductService'

let fakeProductsRepository: FakeProductsRepository
let createProductsService: CreateProductsService
let updateProductService: UpdateProductService

describe('Update product', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		createProductsService = new CreateProductsService(fakeProductsRepository)
		updateProductService = new UpdateProductService(fakeProductsRepository)
	})

	it('Should be able to update a product', async () => {
		const product = await createProductsService.execute({
			name: 'Pizza',
			description: 'Mista',
			price: 50,
		})

		const update_product = await updateProductService.execute({
			id: product.id,
			name: 'Pizza',
			description: 'Bacon',
			price: 50
		})

		expect(product.id).toBe(update_product.id)
		expect(product.name).toBe(update_product.name)
		expect(product.description).toBe(update_product.description)
		expect(product.price).toBe(update_product.price)
	})
})