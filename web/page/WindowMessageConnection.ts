
import { Connection } from '../../common/ConnectionManager';
import { AppMessage } from '../../common/AppMessage';

export class WindowMessageConnection extends Connection {
    constructor(private _win: Window) {
        super();

        _win.addEventListener('message', this._handleMessage);
    }

    public send(msg: AppMessage) {
        this._win.postMessage(msg, '*');
    }

    public close() {
        this._win.removeEventListener('message', this._handleMessage);
        super.close();
    }

    private _handleMessage(event: MessageEvent) {
        if (event.data) {
            this.emit('message', event.data);
        }
    }
}