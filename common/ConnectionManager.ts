import { EventEmitter } from 'events';
import { AppMessage } from './AppMessage';

export class ConnectionManagerImpl extends EventEmitter {
    addConnection() {}

    send(message: AppMessage) {}

}

export const ConnectionManager = new ConnectionManagerImpl();