import { WebSocketConnection } from "./WebSocketConnection";
import { Connection, ConnectionManager } from "../../common/ConnectionManager";
import { AppMessage, AppEvent } from "../../common/AppMessage";
import { WindowMessageConnection } from "../page/WindowMessageConnection";

interface PageInfo {
    frame: HTMLIFrameElement;
    tab: HTMLButtonElement;
    conn: Connection;
}

function initialize() {
    const host = window.location.hostname + ':' + window.location.port;
    const initialPages = (window.location.search.match(/pages=([^&]+)/i) || [null, ''])[1].split(',');
    const pages: { [key: string]: PageInfo } = {};
    const pageContainer = document.querySelector('div#pages');
    
    const ws = new WebSocket(`ws://${host}/connect`)

    const conn: Connection = new WebSocketConnection(ws);
    ConnectionManager.addConnection(conn);

    const addPage = (name) => {
        // add tab
        const tab = document.createElement('button');
        tab.setAttribute('id', name);
        tab.setAttribute('class', 'tab');

        // add iframe
        const frame = document.createElement('iframe');
        frame.setAttribute('id', name);
        frame.setAttribute('class', 'page');
        frame.style.display = 'none';

        pages[name] = { frame, tab, conn: null };

        // listen to messages
        frame.addEventListener('load', _e => {
            const wConn: Connection = new WindowMessageConnection(frame.contentWindow);
            pages[name].conn = wConn;
            wConn.on('message', handlePageMessage.bind(undefined, name));
        });
        frame.setAttribute('src', `/pages/${name}`);
        pageContainer.appendChild(frame);

        // select page
        selectPage(name);
    }

    addPage('config');
    initialPages.map(addPage);

    const handlePageMessage = (pageName: string, message: AppMessage) => {
        if (message.event === AppEvent.TRIGGER && message.path.startsWith('/pages/')) {
            selectPage(message.path.split('/')[2]);
        }

        conn.send(message);
    }

    const selectPage = (name: string) => {
        const names = Object.keys(pages);
        for (const p of names) {
            if (p === name) {
                pages[p].frame.style.display = 'inline-block';
                pages[p].tab.className = 'tab selected';
            }
            else {
                pages[p].frame.style.display = 'none';
                pages[p].tab.className = 'tab';
            }
        }
    }
}

if (window.document.readyState === 'loading') {
    window.document.addEventListener('load', initialize, { once: true });
}
else {
    initialize();
}