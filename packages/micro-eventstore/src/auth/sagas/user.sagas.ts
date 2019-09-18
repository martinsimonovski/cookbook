import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/impl/user-created.event';
import { delay, map } from 'rxjs/operators';

export class KillDragonCommand {
    constructor(
        public readonly heroId: string,
        public readonly dragonId: string,
    ) { }
}

@Injectable()
export class UsersSagas {
    @Saga()
    userCreated = (events$: Observable<any>): Observable<ICommand> => {
        console.log('Kill Dragon ====> ');
        return events$
            .pipe(
                ofType(UserCreatedEvent),
                delay(1000),
                map(event => {
                    Logger.log('Inside [UsersSagas] Saga', 'UsersSagas');
                    return null;
                    // return new KillDragonCommand('123', '456');
                })
            )
    }
}