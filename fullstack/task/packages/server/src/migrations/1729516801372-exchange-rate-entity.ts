import { MigrationInterface, QueryRunner } from "typeorm";

export class exchangeRateEntity1729516801372 implements MigrationInterface {
    name = 'exchangeRateEntity1729516801372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exchange_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAtUtc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAtUtc" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleteDateUtc" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "country" character varying(255) NOT NULL, "currency" character varying(255) NOT NULL, "amount" integer NOT NULL DEFAULT '1', "code" character varying(255) NOT NULL, "rate" numeric NOT NULL, CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
    }

}
