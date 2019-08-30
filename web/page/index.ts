import { AppEvent } from '../../common/AppMessage';
import { WindowMessageConnection } from './WindowMessageConnection';
import { Connection, ConnectionManager } from '../../common/ConnectionManager';

import * as w from './widgets';

function initialize() {
    const pageId = window.location.pathname.split('/').pop();

    const conn: Connection = new WindowMessageConnection(window.parent);
    ConnectionManager.addConnection(conn);

    const widgetMap = {
        'button': w.ButtonWidget,

        'checkbox': w.UnrecognizedWidget,
        'color': w.UnrecognizedWidget,
        'date': w.UnrecognizedWidget,
        'datetime-local': w.UnrecognizedWidget,
        'email': w.UnrecognizedWidget,
        'file': w.UnrecognizedWidget,
        'hidden': w.UnrecognizedWidget,
        'image': w.UnrecognizedWidget,
        'month': w.UnrecognizedWidget,
        'number': w.UnrecognizedWidget,
        'password': w.UnrecognizedWidget,
        'radio': w.UnrecognizedWidget,
        'range': w.UnrecognizedWidget,
        'reset': w.UnrecognizedWidget,
        'search': w.UnrecognizedWidget,
        'submit': w.UnrecognizedWidget,
        'tel': w.UnrecognizedWidget,
        'text': w.UnrecognizedWidget,
        'time': w.UnrecognizedWidget,
        'url': w.UnrecognizedWidget,
        'week': w.UnrecognizedWidget,
    };

    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; ++i) {
        new w.ButtonWidget(buttons[i])
    }

    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; ++i) {
        const type = inputs[i].type;
        new (widgetMap[type])(inputs[i]);
    }

    setImmediate(() => ConnectionManager.send({
        path: `/pages/${pageId}`,
        event: AppEvent.READY,
        value: document.head.title || pageId
    }))
}

if (window.document.readyState === 'loading') {
    window.document.addEventListener('load', initialize, { once: true });
}
else {
    initialize();
}