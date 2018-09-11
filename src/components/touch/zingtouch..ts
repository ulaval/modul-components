import ZingTouch from 'zingtouch';

type ZingGestureCallback = (event: CustomEvent) => void;
interface ZingGesture {}

export enum ZingTouchGestures {
    Tap = 'tap',
    Swipe = 'swipe'
}

export enum ZingGestureDirections {
    Left = 'left',
    Right = 'right',
    None = 'none'
}

export interface ZingRegion {
    bind(element: HTMLElement, gesture: ZingTouchGestures | ZingGesture, callback: ZingGestureCallback): void;
    unbind(element: HTMLElement): void;
}

class ZingTouchGestureFactory {
    getGesture(gesture: ZingTouchGestures, params?: any): ZingGesture {
        switch (gesture) {
            case 'tap':
                return new ZingTouch.Tap(params || {});
            case 'swipe':
                return new ZingTouch.Swipe(params || {});
            default: throw new Error(`ZingTouchUtil: Unrecognized gesture ${gesture}.`);
        }
    }
}

class ZingTouchInternal {
    public GestureFactory = new ZingTouchGestureFactory();

    setupRegion(element: HTMLElement, capture: boolean = true, preventDefault: boolean = true): ZingRegion {
        return new ZingTouch.Region(element, capture, preventDefault);
    }

    detectDirection(angle: number, threshold: number = 0): ZingGestureDirections {
        if ((angle >= 360 - threshold && angle <= 360) || (angle <= threshold && angle >= 0)) {
            return ZingGestureDirections.Right;
        } else if (angle >= 180 - threshold && angle <= 180 + threshold) {
            return ZingGestureDirections.Left;
        }

        return ZingGestureDirections.None;
    }
}

const ZingTouchUtil: ZingTouchInternal = new ZingTouchInternal();
export default ZingTouchUtil;
