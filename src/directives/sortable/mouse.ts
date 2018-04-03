// https://gist.github.com/electricg/4435259
// Which HTML element is the target of the event
export type MousePositionEvent = (e: MouseEvent, relativeToEl?: HTMLElement) => { x: number, y: number };
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
export const mousePositionDocument: MousePositionEvent = (e: MouseEvent) => {
    let posx: number = 0;
    let posy: number = 0;
    if (!e) {
        e = window.event as MouseEvent;
    }
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
        x : posx,
        y : posy
    };
};

// Find out where an element is on the page
// From http://www.quirksmode.org/js/findpos.html
export const findPos: (obj: HTMLElement) => { left: number, top: number } = (obj: HTMLElement) => {
    let curleft: number = 0;
    let curtop: number = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent as HTMLElement;
        } while (obj);
    }
    return {
        left : curleft,
        top : curtop
    };
};

// Mouse position relative to the element
// not working on IE7 and below
export const mousePositionElement: MousePositionEvent = (e: MouseEvent, relativeToEl?: HTMLElement) => {
    const mousePosDoc = mousePositionDocument(e);
    const target = mouseTarget(e);
    const targetPos = relativeToEl ? findPos(relativeToEl) : findPos(target);
    const posx = mousePosDoc.x - targetPos.left;
    const posy = mousePosDoc.y - targetPos.top;
    return {
        x : posx,
        y : posy
    };
};
