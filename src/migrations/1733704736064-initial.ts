import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1733704736064 implements MigrationInterface {
    name = 'Initial1733704736064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "imgUrl" text NOT NULL DEFAULT 'https://example.com/default-image.png', "categoryid" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "orderId" uuid, CONSTRAINT "REL_147bc15de4304f89a93c7eee96" UNIQUE ("orderId"), CONSTRAINT "PK_278a6e0f21c9db1653e6f406801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "orderDetailId" uuid, CONSTRAINT "REL_749e30f71cc0d2d95f8546f459" UNIQUE ("orderDetailId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(20) NOT NULL, "phone" integer, "country" character varying(50), "address" text, "city" character varying(50), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_order_details_order_details" ("productsId" uuid NOT NULL, "orderDetailsId" uuid NOT NULL, CONSTRAINT "PK_6e479078724c7021a8460d36ad7" PRIMARY KEY ("productsId", "orderDetailsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6e6c7ee1d7f3a557ba8f599ce" ON "products_order_details_order_details" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d01089028de42dd7afc853101b" ON "products_order_details_order_details" ("orderDetailsId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_a5a1cf7dc103ccc33b70284be88" FOREIGN KEY ("categoryid") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_147bc15de4304f89a93c7eee969" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_749e30f71cc0d2d95f8546f4592" FOREIGN KEY ("orderDetailId") REFERENCES "order_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_order_details_order_details" ADD CONSTRAINT "FK_f6e6c7ee1d7f3a557ba8f599ced" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_order_details_order_details" ADD CONSTRAINT "FK_d01089028de42dd7afc853101bb" FOREIGN KEY ("orderDetailsId") REFERENCES "order_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_order_details_order_details" DROP CONSTRAINT "FK_d01089028de42dd7afc853101bb"`);
        await queryRunner.query(`ALTER TABLE "products_order_details_order_details" DROP CONSTRAINT "FK_f6e6c7ee1d7f3a557ba8f599ced"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_749e30f71cc0d2d95f8546f4592"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_147bc15de4304f89a93c7eee969"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_a5a1cf7dc103ccc33b70284be88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d01089028de42dd7afc853101b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6e6c7ee1d7f3a557ba8f599ce"`);
        await queryRunner.query(`DROP TABLE "products_order_details_order_details"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_details"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
