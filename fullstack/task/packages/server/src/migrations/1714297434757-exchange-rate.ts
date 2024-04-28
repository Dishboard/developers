import { MigrationInterface, QueryRunner } from "typeorm";

export class exchangeRate1714297434757 implements MigrationInterface {
    name = 'exchangeRate1714297434757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exchange_rate" ("id" SERIAL NOT NULL, "country" character varying NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, "code" character varying NOT NULL, "rate" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
    }

}
