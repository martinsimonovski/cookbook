import { Module, OnModuleInit } from '@nestjs/common';
import { EventStoreModule } from './eventsource/event-store.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EventStoreModule.forRoot(),
    AuthModule
  ],
})
export class AppModule { }
