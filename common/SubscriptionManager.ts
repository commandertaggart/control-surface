
import { ConnectionManager } from './ConnectionManager';
import { AppMessage } from './AppMessage';
import { parenthesizedExpression } from '@babel/types';

export type SubscriptionCallback = (path: string, value: any) => void;

export class Subscription {
    constructor(private _path: string, private _callback: SubscriptionCallback) {}

    unsubscribe() {
        SubscriptionManager['_unsubscribe'](this);
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

    constructor() {
        this._root = STN('');
        ConnectionManager.on('message', this._handleMessage.bind(this))
    }

    public subscribe(path, callback): Subscription {
        const sub = new Subscription(path, callback);
        const node = this._getNodeForPath(path, true);
        node[$subscriptions].push(sub);
        return sub;
    }

    private _unsubscribe(sub: Subscription) {
        const node = this._getNodeForPath(sub['_path']);
        if (node) {
            const idx = node[$subscriptions].indexOf(sub);
            if (idx >= 0) {
                node[$subscriptions].splice(idx, 1);

                if (node[$subscriptions].length == 0 && node[$parent]) {
                    delete node.parent[node[$key]];
                }
                return true;
            }
        }
        return false;
    }

    private _handleMessage(msg: AppMessage) {
        const subs = this._gatherSubscribers(msg.path);
        for (const sub of subs) {
            // check this just in case one sub callback causes 
            // another to unsubscribe
            if (sub['_callback']) {
                sub['_callback'](msg.path, msg.value);
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
        const parts = path.split('/');
        if (parts[0] !== '') {
            throw new Error(`Invalid path: ${path}`);
        }
        parts.shift(); // initial '/'

        const gather = (node: SubscriptionTreeNode): Subscription[] => {
            const list = [... node[$subscriptions]];

            for (const key in node) {
                list.push(... gather(node[key]));
            }

            return list;
        }

        const dive = (parts: string[], node: SubscriptionTreeNode): Subscription[] => {
            if (parts.length === 0) {
                return gather(node);
            }
            else if (parts[0] in node) {
                const part = parts.shift();
                return dive(parts, node[part])
            }
        }

        return dive(parts, this._root);
    }
}