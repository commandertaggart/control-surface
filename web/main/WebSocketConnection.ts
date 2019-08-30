import { Connection } from '../../common/ConnectionManager';
import { AppMessage } from '../../common/AppMessage';

export class WebSocketConnection extends Connection {
    constructor(private _ws: WebSocket) {
        super();

        _ws.addEventListener('message', this._handleMessage);
    }

    public send(msg: AppMessage) {
        this._ws.send(JSON.stringify(msg));
    }

    public close() {
        this._ws.removeEventListener('message', this._handleMessage);
        super.close();
    }

    private _handleMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data.toString());
            this.emit('message', data);
        }
        catch (err) {
            console.error('Failed to handle event');
            console.error(event);
        }
    }
}