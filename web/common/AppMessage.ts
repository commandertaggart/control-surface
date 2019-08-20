
export enum AppEvent {
    // client messages
    READY = 'ready',
    SUBSCRIBE = 'subscribe',
    GET = 'get',
    SET = 'set',
    TRIGGER = 'trigger',
    TOGGLE = 'toggle',
    ZERO = 'zero',

    // server responses
    UPDATE = 'update',
    SUCCESS = 'success',
    FAILURE = 'fail'
};

export interface AppMessage {
    path: string,
    event: AppEvent,
    value?: any,
    message?: string
}