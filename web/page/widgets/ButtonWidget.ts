import { Widget } from './Widget';
import { AppMessage, AppEvent } from '../../../common/AppMessage';
import { ConnectionManager } from '../../../common/ConnectionManager';

export class ButtonWidget extends Widget {
    constructor(el: HTMLElement) {
        super(el);

        if (this.isInstrumented) {
            Widget.SubscriptionManager.subscribe(
                this.path, this._handleMessage.bind(this));

            el.addEventListener('click', this._onClick.bind(this))
        }
    }

    private _onClick(e: MouseEvent) {
        const m: AppMessage = {
            path: this.path,
            event: AppEvent.TRIGGER
        };

        ConnectionManager.send(m);
    }

    private _handleMessage(msg: AppMessage) {
        if (!msg.path.startsWith(this.path)) {
            console.warn(`Received message for wrong path: ${msg.path}`);
        }

        const subpath = msg.path.substr(this.path.length);

        switch (subpath) {
            case '':
                if (msg.event === AppEvent.FAILURE) {
                    // show error
                }
                break;
            case '/@color':
                // change button collor
                break;
            case '/@alert':
                // set alert level
                break;
            case '/@enabled':
                // set enabled state
                const disabled = !msg.value;
                this.el.setAttribute('disabled', disabled.toString());
                break;
        }
    }
}