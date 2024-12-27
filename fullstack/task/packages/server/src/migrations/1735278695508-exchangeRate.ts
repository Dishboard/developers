import { MigrationInterface, QueryRunner } from 'typeorm';

export class exchangeRate1735278695508 implements MigrationInterface {
    name = 'exchangeRate1735278695508';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "exchange_rate" ("id" SERIAL NOT NULL, "country" character varying NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, "code" character varying NOT NULL, "rate" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
    }
}
