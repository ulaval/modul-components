// Inspiration => https://acko.net/blog/mouse-handling-and-absolute-positions-in-javascript/.
const getRelativeMousePos: (event: MouseEvent | CustomEvent, reference: HTMLElement) => RelativeMousePos =
    (event: Event, reference: HTMLElement) => {
        let x: number = 0;
        let y: number = 0;

        const mouseEvent: MouseEvent = event as MouseEvent;
        let pos: any;
        let el: HTMLElement | undefined = undefined;
        if (mouseEvent && mouseEvent.offsetX !== undefined && mouseEvent.offsetY !== undefined) {
            pos = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
            el = mouseEvent.target as HTMLElement;
        }

        const customEvent: CustomEvent = event as CustomEvent;
        if (customEvent && customEvent.detail && customEvent.detail.offsetX !== undefined && customEvent.detail.offsetY !== undefined) {
            pos = { x: customEvent.detail.offsetX, y: customEvent.detail.offsetY };
            el = customEvent.detail.target as HTMLElement;
        }

        if (el === reference) {
            return { x: pos.x, y: pos.y };
        }

        if (!pos || !el) {
            return { x: 0, y: 0 };
        }

        // Fix for firefox.
        let recursiveElement: HTMLElement = el;
        while (recursiveElement.nodeType === Node.TEXT_NODE) {
            recursiveElement = recursiveElement.parentElement as HTMLElement;
        }

        // Send the coordinates upwards through the offsetParent chain.
        while (recursiveElement) {
            (recursiveElement as any).mouseX = pos.x || 0;
            (recursiveElement as any).mouseY = pos.y || 0;
            pos.x += (recursiveElement).offsetLeft || 0;
            pos.y += (recursiveElement).offsetTop || 0;
            recursiveElement = (recursiveElement).offsetParent as HTMLElement;
        }

        // Look for the coordinates starting from the reference element.
        let recursiveReference: HTMLElement = reference;
        let offset: any = { x: 0, y: 0 };
        while (recursiveReference) {
            if (typeof (recursiveReference as any).mouseX !== 'undefined') {
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

export interface RelativeMousePos {
    x: number;
    y: number;
}

export type MousePositionEvent<T> = (e: MouseEvent | CustomEvent, relativeToEl?: HTMLElement) => T;
export const mousePositionElement: MousePositionEvent<RelativeMousePos> = (e: MouseEvent | CustomEvent, relativeToEl: HTMLElement) => {
    return getRelativeMousePos(e, relativeToEl);
};

export const isInElement: MousePositionEvent<boolean> = (e: MouseEvent | CustomEvent, relativeToEl: HTMLElement, threshold: number = 3) => {
    const mousePosition: RelativeMousePos = mousePositionElement(e, relativeToEl);
    return mousePosition.x > 0 && mousePosition.y > 0
            && mousePosition.x + threshold <= relativeToEl.offsetWidth
            && mousePosition.y + threshold <= relativeToEl.offsetHeight;
};

export class MouseButtons {
    public static LEFT = 0;
    public static WHEEL = 1;
    public static RIGHT = 2;
    public static BROWSER_BACK = 3;
    public static BROWSER_FORWARD = 4;
}
