import { EventEmitter } from 'events';
import { AppMessage } from './AppMessage';

export class Connection extends EventEmitter {
    send(message: AppMessage) {
        throw new Error('Subclass must implement send method.');
    }

    close() {
        ConnectionManager.removeConnection(this);
    }
}

export class ConnectionManagerImpl extends EventEmitter {
    private _connections: Connection[] = [];

    public addConnection(conn: Connection) {
        conn.on('message', this._handleMessage.bind(this));
        this._connections.push(conn);
    }

    public removeConnection(conn: Connection) {
        const idx = this._connections.indexOf(conn);
        if (idx >= 0) {
            this._connections.splice(idx, 1);
            conn.send = () => {
                throw new Error('This connection is closed');
            };
        }
    }

    send(message: AppMessage) {
        this._connections.forEach(c => c.send(message));
    }

    private _handleMessage(msg: AppMessage) {
        this.emit('message', msg);
    }
}

export const ConnectionManager = new ConnectionManagerImpl();