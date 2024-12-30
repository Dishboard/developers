import { MigrationInterface, QueryRunner } from "typeorm";

export class createExchangeRatesTable1735573865264 implements MigrationInterface {
    name = 'createExchangeRatesTable1735573865264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchange_rate" ALTER COLUMN "rate" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchange_rate" ALTER COLUMN "rate" TYPE numeric(3,3)`);
    }

}
