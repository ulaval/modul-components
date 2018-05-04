// Utils that allow to get mouse pointer relative to an element.
// https://gist.github.com/electricg/4435259
// Which HTML element is the target of the event
export type MousePositionEvent<T> = (e: MouseEvent, relativeToEl?: HTMLElement) => T;
export const mouseTarget: (e: MouseEvent) => HTMLElement = (e: Event) => {
    let targ: HTMLElement = document.documentElement as HTMLElement;
    if (!e) { let e: Event | undefined = window.event; }
    if (e.target) {
        targ = e.target as HTMLElement;
    } else if (e.srcElement) {
        targ = e.srcElement as HTMLElement;
    }

    if (targ.nodeType === 3) { // defeat Safari bug
        targ = targ.parentNode as HTMLElement;
    }
    return targ;
};

// Mouse position relative to the document
// From http://www.quirksmode.org/js/events_properties.html
export const mousePositionDocument: MousePositionEvent<{ x: number, y: number }> = (e: MouseEvent) => {
    let posx: number = 0;
    let posy: number = 0;
    if (!e) {
        e = window.event as MouseEvent;
    }
    if (e.pageX || e.pageY) {
        posx = e.pageX - window.pageXOffset;
        posy = e.pageY - window.pageYOffset;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX;
        posy = e.clientY;
    }
    return {
        x : e.clientX,
        y : e.clientY
    };
};

const findPos: (event: MouseEvent | CustomEvent, reference: HTMLElement) => { x: number, y: number } =
    (event: MouseEvent | CustomEvent, reference: HTMLElement) => {
        /* if (event.currentTarget === reference && event.offsetX !== undefined && event.offsetY !== undefined) {
            return { x: event.offsetX, y: event.offsetY };
        }

        if (event.currentTarget === reference && event.clientX !== undefined && event.clientY !== undefined) {
            const rect = reference.getBoundingClientRect();
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        } */

        return findPosRecursive(event, reference);
    };

const findPosRecursive: (event: Event, reference: HTMLElement) => { x: number, y: number } =
    (event: Event, reference: HTMLElement) => {
        console.log('begin');
        let x: number = 0;
        let y: number = 0;

        const mouseEvent = event as MouseEvent;
        let pos: any;
        let el: HTMLElement | undefined = undefined;
        if (mouseEvent && mouseEvent.offsetX !== undefined && mouseEvent.offsetY !== undefined) {
            pos = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
            el = mouseEvent.target as HTMLElement;
        }

        const customEvent = event as CustomEvent;
        if (customEvent && customEvent.detail && customEvent.detail.offsetX !== undefined && customEvent.detail.offsetY !== undefined) {
            pos = { x: customEvent.detail.offsetX, y: customEvent.detail.offsetY };
            el = customEvent.detail.target as HTMLElement;
        }

        if (el === reference) {
            return { x: pos.x, y: pos.y };
        }

        if (!pos || !el) {
            console.error('do something');
            return { x: 0, y: 0 };
        }

       /* if (el.offsetParent) {
            let lastOffsetParent: HTMLElement = el.offsetParent as HTMLElement;
            do {
                if (el.offsetParent && el.offsetParent !== lastOffsetParent) {
                    pos.x += el.offsetLeft;
                    pos.y += el.offsetTop;
                    lastOffsetParent = el.offsetParent as HTMLElement;
                }
                el = el.parentElement as HTMLElement;
            } while (el && el !== reference);
        }
 */

        // Send the coordinates upwards through the offsetParent chain.
        let recursiveElement = el as HTMLElement;
        while (recursiveElement) {
            (recursiveElement as any).mouseX = pos.x || 0;
            (recursiveElement as any).mouseY = pos.y || 0;
            pos.x += (recursiveElement as HTMLElement).offsetLeft || 0;
            pos.y += (recursiveElement as HTMLElement).offsetTop || 0;
            recursiveElement = (recursiveElement as HTMLElement).offsetParent as HTMLElement;
        }

        // Look for the coordinates starting from the reference element.
        let recursiveReference: HTMLElement = reference;
        let offset = { x: 0, y: 0 };
        while (recursiveReference) {
            if (typeof (recursiveReference as any).mouseX != 'undefined') {
                x = (recursiveReference as any).mouseX - offset.x;
                y = (recursiveReference as any).mouseY - offset.y;
                break;
            }
            offset.x += recursiveReference.offsetLeft || 0;
            offset.y += recursiveReference.offsetTop || 0;
            recursiveReference = recursiveReference.offsetParent as HTMLElement;
        }

        // Reset stored coordinates
        let recursiveCleanup: HTMLElement = el;
        while (recursiveCleanup) {
            (recursiveCleanup as any).mouseX = undefined;
            (recursiveCleanup as any).mouseY = undefined;
            recursiveCleanup = recursiveCleanup.offsetParent as HTMLElement;
        }

        // Subtract distance to middle
        console.log(x, y);
        return { x, y };
    };

const findPosRecurasassive: (event: MouseEvent, reference: HTMLElement) => { x: number, y: number } =
    (event: MouseEvent, reference: HTMLElement) => {
        let x: number = 0;
        let y: number = 0;
        const el: HTMLElement = (event.target) as HTMLElement;

        // Use offset coordinates and find common offsetParent
        const pos = { x: event.offsetX, y: event.offsetY };

        // Send the coordinates upwards through the offsetParent chain.
        let recursiveElement = el as HTMLElement;
        while (recursiveElement) {
            (recursiveElement as any).mouseX = pos.x || 0;
            (recursiveElement as any).mouseY = pos.y || 0;
            pos.x += (recursiveElement as HTMLElement).offsetLeft || 0;
            pos.y += (recursiveElement as HTMLElement).offsetTop || 0;
            recursiveElement = (recursiveElement as HTMLElement).offsetParent as HTMLElement;
        }

        // Look for the coordinates starting from the reference element.
        let recursiveReference: HTMLElement = reference;
        let offset = { x: 0, y: 0 };
        while (recursiveReference) {
            if (typeof (recursiveReference as any).mouseX != 'undefined') {
                x = (recursiveReference as any).mouseX - offset.x;
                y = (recursiveReference as any).mouseY - offset.y;
                break;
            }
            offset.x += recursiveReference.offsetLeft || 0;
            offset.y += recursiveReference.offsetTop || 0;
            recursiveReference = recursiveReference.offsetParent as HTMLElement;
        }

        // Reset stored coordinates
        let recursiveCleanup: HTMLElement = el;
        while (recursiveCleanup) {
            (recursiveCleanup as any).mouseX = undefined;
            (recursiveCleanup as any).mouseY = undefined;
            recursiveCleanup = recursiveCleanup.offsetParent as HTMLElement;
        }

        // Subtract distance to middle
        return { x, y };
    };

// Mouse position relative to the element
// not working on IE7 and below
export interface RelativeMousePos {
    x: number;
    y: number;
}
export const mousePositionElement: MousePositionEvent<RelativeMousePos> = (e: MouseEvent, relativeToEl: HTMLElement) => {
    // console.log('mouse position is ', findPos(e, relativeToEl), relativeToEl);
    return findPos(e, relativeToEl);
};

export const isInElement: MousePositionEvent<boolean> = (e: MouseEvent, relativeToEl: HTMLElement, threshold: number = 3) => {
    const mousePosition = mousePositionElement(e, relativeToEl);
    return mousePosition.x > 0 && mousePosition.y > 0
            && mousePosition.x + threshold <= relativeToEl.offsetWidth
            && mousePosition.y + threshold <= relativeToEl.offsetHeight;
};
