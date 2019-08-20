
import { ConnectionManager } from './ConnectionManager';
import { AppMessage } from './AppMessage';

export type SubscriptionCallback = (path: string, value: any) => void;
export interface Subscription {
    unsubscribe: () => void;
}

const $subscriptions = Symbol('subscriptions');
interface SubscriptionTreeNode {
    [$subscriptions]: Subscription[];
    [key: string]: SubscriptionTreeNode;
}

export class SubscriptionManager {
    
    constructor() {
        
        ConnectionManager.on('message', (message: AppMessage) => {

        })
    }

    subscribe(path, callback): Subscription {
        ConnectionManager
        return () => {
            ConnectionManager.
        }
    }
}