import { SubscriptionManager } from '../../../common/SubscriptionManager';

export const $WIDGET = Symbol('Widget');

const pathPattern = /^\/([a-zA-Z0-9\-_]\/)$/
export class Widget {
    public static SubscriptionManager = new SubscriptionManager();
    
    public readonly path: string;

    constructor(public el: HTMLElement) {
        this.path = this.el.getAttribute('data-path') || this.el.id
        if (this.isInstrumented) {
            el[$WIDGET] = this;
        }
        else {
            this.path = null;
        }
    }

    public get isInstrumented(): boolean {
        if (this.path && pathPattern.test(this.path)) {
            return true;
        }
        return false;
    }
}