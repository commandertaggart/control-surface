
import { ConnectionManager } from './ConnectionManager';
import { AppMessage, AppEvent } from './AppMessage';

export type SubscriptionCallback = (message: AppMessage) => void;

export class Subscription {
    constructor(
        private _path: string, 
        private _callback: SubscriptionCallback,
        private _manager: SubscriptionManager
    ) {}

    unsubscribe() {
        this._manager['_unsubscribe'](this);
        this._callback = null;
    }
}

const $subscriptions = Symbol('subscriptions');
const $parent = Symbol('parent');
const $key = Symbol('key');
interface SubscriptionTreeNode {
    [$subscriptions]: Subscription[];
    [$parent]: SubscriptionTreeNode | null;
    [$key]: string;
    [key: string]: SubscriptionTreeNode;
}
function STN(key: string, parent: SubscriptionTreeNode = null): SubscriptionTreeNode {
    return { [$subscriptions]: [], [$parent]: parent, [$key]: key }
}

export class SubscriptionManager {
    private _root: SubscriptionTreeNode;
    private _messageHandler: (... args: any[]) => void;

    constructor() {
        this._root = STN('');
        this._messageHandler = null;
    }

    public subscribe(path: string, callback: SubscriptionCallback): Subscription {
        if (!this._messageHandler) {
            this._messageHandler = this._handleMessage.bind(this);
            ConnectionManager.on('message', this._messageHandler);
        }

        const sub = new Subscription(path, callback, this);
        const node = this._getNodeForPath(path, true);
        node[$subscriptions].push(sub);

        ConnectionManager.send({
            path: path,
            event: AppEvent.SUBSCRIBE
        });
        
        return sub;
    }

    private _unsubscribe(sub: Subscription) {
        const node = this._getNodeForPath(sub['_path']);
        if (node) {
            const idx = node[$subscriptions].indexOf(sub);
            if (idx >= 0) {
                node[$subscriptions].splice(idx, 1);

                if (node[$subscriptions].length == 0 && node[$parent]) {
                    const parent = node[$parent];
                    delete parent[node[$key]];
                    if (parent === this._root &&
                        Object.keys(parent).length === 0) {
                        ConnectionManager.off('message', this._messageHandler);
                        this._messageHandler = null;
                    }
                }
                return true;
            }
        }
        return false;
    }

    private _handleMessage(msg: AppMessage) {
        // console.log('MESSAGE', msg);
        const subs = this._gatherSubscribers(msg.path);
        for (const sub of subs) {
            // check this just in case one sub callback causes 
            // another to unsubscribe
            if (sub['_callback']) {
                sub['_callback'](msg);
            }
        }
    }

    private _getNodeForPath(path: string, create: boolean = false): SubscriptionTreeNode {
        const parts = path.split('/');
        if (parts[0] !== '') {
            throw new Error(`Invalid path: ${path}`);
        }
        parts.shift(); // initial '/'

        let node = this._root;
        for (const part of parts) {
            if (part in node) {
                node = node[part];
            }
            else {
                if (create) {
                    node = node[part] = STN(part, node);
                }
                else {
                    return null;
                }
            }
        }

        return node;
    }

    private _gatherSubscribers(path: string): Subscription[] {
        const subs: Subscription[] = [... this._root[$subscriptions]];

        const parts = path.split('/');
        if (parts[0] !== '') {
            throw new Error(`Invalid path: ${path}`);
        }
        parts.shift(); // initial '/'
        if (parts.length === 1 && parts[0] === '') {
            // just '/'
            parts.shift();
        }

        let node = this._root;
        for (const part of parts) {
            if (part in node) {
                node = node[part];
                subs.push(... node[$subscriptions]);
            }
            else {
                break;
            }
        }

        return subs;
    }
}