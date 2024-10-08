import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExchangeRatesTable1695735084573 implements MigrationInterface {
    name = 'CreateExchangeRatesTable1695735084573';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the exchange_rates table
        await queryRunner.query(`
            CREATE TABLE "exchange_rates" (
                "id" SERIAL NOT NULL,
                "validFor" character varying(255) NOT NULL,
                "order" integer NOT NULL,
                "country" character varying(255) NOT NULL,
                "currency" character varying(255) NOT NULL,
                "amount" integer NOT NULL,
                "currencyCode" character varying(10) NOT NULL,
                "rate" numeric(15, 6) NOT NULL,
                "createdAtUtc" BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000,
                CONSTRAINT "PK_exchange_rates_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the exchange_rates table
        await queryRunner.query(`DROP TABLE "exchange_rates"`);
    }
}
