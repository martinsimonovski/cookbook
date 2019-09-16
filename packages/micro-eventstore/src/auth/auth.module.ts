import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventStoreModule } from './core/event-store/event-store.module';

@Module({
    imports: [
        EventStoreModule.forRoot(),
        /** ------------- */
        AuthModule,
    ],
})
export class AppModule implements OnModuleInit {
    async onModuleInit() { }
}