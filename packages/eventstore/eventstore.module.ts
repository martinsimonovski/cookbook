import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            name: 'eventConnection',
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'admin',
            password: 'admin',
            database: 'eventstore',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        })
    ],
    providers: [],
    exports: []
})
export class EventstoreModule { }