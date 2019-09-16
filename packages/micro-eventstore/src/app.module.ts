import { Module, OnModuleInit } from '@nestjs/common';
import { EventStoreModule } from './eventsource/event-store.module';

@Module({
  imports: [
    EventStoreModule.forRoot()
  ],
})
export class AppModule { }
