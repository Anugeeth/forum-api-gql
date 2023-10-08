import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { DataSourceOptions, DataSource } from 'typeorm'
import 'dotenv/config';


export const ormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun : true

}


export const connectionSource = new DataSource(ormConfig as DataSourceOptions);
