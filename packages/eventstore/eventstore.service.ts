import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Event } from './entities/event.entity';
import { Stream } from './entities/stream.entity';

@Injectable()
export class EventstoreService {
    constructor(
        @InjectEntityManager('eventConnection')
        private readonly entityManager: EntityManager
    ) { }

    public async createEvent<D, M>(
        streamId: string,
        streamType: string,
        eventData: D,
        eventType: string,
        eventMetadata: M
    ) {
        const streamRepo = this.entityManager.getRepository<Stream>('stream');
        let stream;

        try {
            stream = await streamRepo.findOneOrFail(streamId);
        } catch (e) {
            stream = await streamRepo.save({ streamId, version: 0, type: streamType });
        }

        const eventRepo = this.entityManager.getRepository<Event>('event');
        await eventRepo.save({
            data: eventData,
            type: eventType,
            meta: eventMetadata,
            version: stream.version + 1,
            streamId: stream.streamId
        });

        await streamRepo.update({ streamId: stream.streamId }, { ...stream, version: stream.version + 1 });
    }
}