import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './auth.module';
// import { EventStoreModule } from './event'

@Module({
    imports: [
        EventStoreModule.forRoot(),
        AuthModule
    ]
})
export class AppModule implements OnModuleInit {
    async onModuleInit() {

    }
}