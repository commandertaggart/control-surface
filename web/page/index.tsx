import { AppMessage, AppEvent } from '../../common/AppMessage';

function initialize() {
    const send = (message: AppMessage) => {
        if (window.parent) {
            window.parent.postMessage(message, '*');
        }
        else {
            throw new Error(`Cannot send message, no parent window: ${message}`);
        }
    }

    const handleNotSupported = (i, path) => console.warn(`Input type '${i.type}' not suported on '${i.id}'`);
    const handleButton = (b, path) => {
        b.addEventListener('click', () => {
            send({ path, event: AppEvent.TRIGGER })
        })
    }

    const handleInputChange = (i, path) => {
        i.addEventListener('change', (event) => {
            send({ path, event: AppEvent.SET, value: i.value })
        })
    }

    const inputHandlerMap = {
        'button': handleButton,

        'checkbox': handleNotSupported,
        'color': handleNotSupported,
        'date': handleNotSupported,
        'datetime-local': handleNotSupported,
        'email': handleNotSupported,
        'file': handleNotSupported,
        'hidden': handleNotSupported,
        'image': handleNotSupported,
        'month': handleNotSupported,
        'number': handleNotSupported,
        'password': handleNotSupported,
        'radio': handleNotSupported,
        'range': handleNotSupported,
        'reset': handleNotSupported,
        'search': handleNotSupported,
        'submit': handleNotSupported,
        'tel': handleNotSupported,
        'text': handleNotSupported,
        'time': handleNotSupported,
        'url': handleNotSupported,
        'week': handleNotSupported,
    };

    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; ++i) {
        const path = buttons[i].getAttribute('data-path') || buttons[i].id;
        if (path && path.startsWith('/')) {
            handleButton(buttons[i], path);
        }
    }

    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; ++i) {
        const path = inputs[i].getAttribute('data-path') || inputs[i].id;
        const type = inputs[i].type;
        if (path && path.startsWith('/')) {
            (inputHandlerMap[type])(inputs[i], path);
        }
    }

    setImmediate(() => send({
        path: `/pages/%pageid%`,
        event: AppEvent.READY
    }))
}

if (window.document.readyState === 'loading') {
    window.document.addEventListener('load', initialize, { once: true });
}
else {
    initialize();
}