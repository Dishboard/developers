import { MigrationInterface, QueryRunner } from "typeorm";

export class updateValidforType1720446731375 implements MigrationInterface {
    name = 'updateValidforType1720446731375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP COLUMN "validFor"`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD "validFor" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP COLUMN "validFor"`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD "validFor" date NOT NULL`);
    }

}
