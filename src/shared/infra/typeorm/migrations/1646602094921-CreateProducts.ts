import { MigrationInterface, QueryRunner, Table} from 'typeorm'

export class CreateProducts1646602094921 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'products',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true
					},
					{
						name: 'name',
						type: 'varchar'
					},
					{
						name: 'description',
						type: 'varchar'
					},
					{
						name: 'price',
						type: 'integer'
					}
				]
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('products')
	}

}
