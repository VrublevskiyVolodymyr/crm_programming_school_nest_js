import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveManagerIdFromComments1698338751114 implements MigrationInterface {
    name = 'RemoveManagerIdFromComments1698338751114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_0c9dbcb8d2df7170caa1d32aad3\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`manager_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`manager_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_0c9dbcb8d2df7170caa1d32aad3\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
