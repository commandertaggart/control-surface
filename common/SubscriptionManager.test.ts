import { EventEmitter } from 'events';

const ConnectionManagerMock = new EventEmitter();
ConnectionManagerMock['send'] = jest.fn();
jest.mock('./ConnectionManager', () => ({ ConnectionManager: ConnectionManagerMock }));

import { SubscriptionManager, Subscription } from './SubscriptionManager';
import { AppEvent } from './AppMessage';

describe('SubscriptionManager', () => {

    afterEach(() => {
        ConnectionManagerMock.removeAllListeners();
    })

    it('accepts subscription', () => {
        const sm = new SubscriptionManager();

        const sub = sm.subscribe('/test/path', m => void(0));

        expect(sub).toBeInstanceOf(Subscription);
        expect(sm['_gatherSubscribers']('/test/path')).toEqual([sub]);
    })

    it('unsubscribes', () => {
        const sm = new SubscriptionManager();

        const sub = sm.subscribe('/test/path', m => void(0));
        sub.unsubscribe();

        expect(sm['_gatherSubscribers']('/test/path')).toEqual([]);
    })

    it('handles message', () => {
        const sm = new SubscriptionManager();

        const cb = jest.fn();
        sm.subscribe('/test/path', cb);
        ConnectionManagerMock.emit('message', {
            path: '/test/path',
            event: AppEvent.UPDATE,
            value: 1
        })

        expect(cb).toHaveBeenCalledWith({
            event: AppEvent.UPDATE,
            path: '/test/path', 
            value: 1
        });
    })

    it('handles message for subpath', () => {
        const sm = new SubscriptionManager();

        const cb = jest.fn();
        sm.subscribe('/test', cb);
        ConnectionManagerMock.emit('message', {
            path: '/test/path',
            event: AppEvent.UPDATE,
            value: 1
        })

        expect(cb).toHaveBeenCalledWith({
            event: AppEvent.UPDATE,
            path: '/test/path', 
            value: 1
        });
    })
})