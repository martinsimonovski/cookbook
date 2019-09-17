import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICommand, ofType } from '@nestjs/cqrs';
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
    userCreated = (events$: Observable<any>): Observable<ICommand> => {
        return events$
            .pipe(
                ofType(UserCreatedEvent),
                delay(1000),
                map(event => {
                    Logger.log('Inside [UsersSagas] Saga', 'UsersSagas');
                    return new KillDragonCommand('123', '456');
                })
            )
    }
}