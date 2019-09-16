import { TCPClient, EventFactory } from 'geteventstore-promise';

export class EventStore {
    [x: string]: any;

    constructor() {
        this.type = 'event-store';
        this.eventFactory = new EventFactory();
    }

    connect(config) {
        this.client = new TCPClient(config);
        return this;
    }

    getClient() {
        return this.client;
    }

    newEvent(name, payload) {
        return this.eventFactory.newEvent(name, payload);
    }

    close() {
        this.client.close();
        return this;
    }
}