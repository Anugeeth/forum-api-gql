import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class ConfigName1696765335936 implements MigrationInterface {
    roles = ['user', 'admin'];

    userData = [
        {
            username: "testuser",
            password: "testPassword",
            role: this.roles[0], 
        },
        {
            username: "testAdmin",
            password: "testPassword",
            role: this.roles[1], 
        },
    ];

    async generate() {
        const queries = [];

        // Hash passwords
        const hashedUserData = await Promise.all(
            this.userData.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword,
                };
            })
        );

        queries.push(
            `INSERT INTO "roles" ("role") VALUES ('${this.roles[0]}'), ('${this.roles[1]}')`
        );

        hashedUserData.forEach((user) => {
            queries.push(
                `INSERT INTO "user" ("username", "password") VALUES ('${user.username}', '${user.password}')`
            );
            const roleId = user.role === this.roles[0] ? 1 : 2;
            queries.push(
                `INSERT INTO "user_role" ("userId", "rolesId") VALUES ((SELECT id FROM "user" WHERE "username" = '${user.username}'), ${roleId})`
            );
        });

        return queries;
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const queries = await this.generate();

        for (const query of queries) {
            await queryRunner.query(query);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
