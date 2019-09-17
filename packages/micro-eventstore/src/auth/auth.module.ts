import { CommandBus, EventBus, CqrsModule } from '@nestjs/cqrs';
import { OnModuleInit, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { UsersSagas } from './sagas/user.sagas';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repository/user.repository';
import { EventStoreModule } from '../eventsource/event-store.module';
import { EventStore } from '../eventsource/event-store.class';
import { UserCreatedEvent } from './events/impl';

@Module({
    imports: [
        CqrsModule,
        EventStoreModule.forFeature()
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UsersSagas,
        ...CommandHandlers,
        ...EventHandlers,
        UserRepository
    ]
})
export class AuthModule { }
// implements OnModuleInit {
//     constructor(
//         private readonly moduleRef: ModuleRef,
//         private readonly command$: CommandBus,
//         private readonly event$: EventBus,
//         private readonly usersSagas: UsersSagas,
//         private readonly eventStore: EventStore,
//     ) { }

//     onModuleInit() {
//         //   this.command$.setModuleRef(this.moduleRef);
//         //   this.event$.set

//         this.eventStore.setEventHandlers(this.eventHandlers);
//         this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
//         this.event$.publisher = this.eventStore;

//         this.event$.register(EventHandlers);
//         this.command$.register(CommandHandlers);
//         this.event$.combineSagas([this.usersSagas.userCreated])

//     }

//     eventHandlers = {
//         UserCreatedEvent: (data) => new UserCreatedEvent(data)
//     }
// }