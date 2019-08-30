import { Widget } from "./Widget";

export class UnrecognizedWidget extends Widget {
    constructor(el: HTMLElement) {
        super(el);

        if (this.isInstrumented) {
            console.warn(`No widget for input type ${el.getAttribute('type')}.  id: ${el.id}`);
        }
    }
}