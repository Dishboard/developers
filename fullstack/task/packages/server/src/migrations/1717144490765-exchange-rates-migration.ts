import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExchangeRateTable1695735084572 implements MigrationInterface {
    name = 'CreateExchangeRateTable1695735084572';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "exchange_rate" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAtUtc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAtUtc" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "deleteDateUtc" TIMESTAMP WITH TIME ZONE,
                "version" integer NOT NULL,
                "code" character varying(255) NOT NULL,
                "currency" character varying(255) NOT NULL,
                "country" character varying(255) NOT NULL,
                "rate" character varying(20) NOT NULL DEFAULT '0.0', -- Assuming rate is a string with max length 20
                "amount" numeric NOT NULL, -- Adjust column type based on your database requirements
                CONSTRAINT "PK_1234567890" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_EXCHANGE_RATE_CODE" UNIQUE ("code"),
                CONSTRAINT "UQ_EXCHANGE_RATE_COUNTRY" UNIQUE ("country")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
    }
}

