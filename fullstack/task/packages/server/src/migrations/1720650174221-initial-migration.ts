import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1720650174221 implements MigrationInterface {
    name = 'initialMigration1720650174221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exchange_rate_language_enum" AS ENUM('CZ', 'EN')`);

        await queryRunner.query(`CREATE TABLE "exchange_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAtUtc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAtUtc" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleteDateUtc" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "currency" character varying(255) NOT NULL, "rate" numeric(10,2) NOT NULL, "amount" integer NOT NULL, "country" character varying(255) NOT NULL, "validFor" TIMESTAMP WITH TIME ZONE NOT NULL, "currencyCode" character varying(255) NOT NULL, "language" "public"."exchange_rate_language_enum" NOT NULL, CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION invalidate_exchange_rate_cache()
            RETURNS VOID AS $$
            BEGIN
                DELETE FROM exchange_rate WHERE "createdAtUtc" < NOW() - INTERVAL '5 minutes';
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            SELECT cron.schedule('*/1 * * * *', 'SELECT invalidate_exchange_rate_cache();');`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
        await queryRunner.query(`DROP TYPE "public"."exchange_rate_language_enum"`);

        await queryRunner.query(`
          DROP FUNCTION IF EXISTS invalidate_exchange_rate_cache();
        `);
    }

}
