import ZingTouch from 'zingtouch';

import { MZingGestureDirections, MZingTapInteractions, MZingTouchGestures } from './enums';

export type MZingGestureCallback = (event: CustomEvent) => void;
export interface MZingGesture {}

export interface MZingRegion {
    bind(element: HTMLElement, gesture: MZingTouchGestures | MZingGesture, callback: MZingGestureCallback): void;
    unbind(element: HTMLElement): void;
}

export class MZingTouchGestureFactory {
    getGesture(gesture: MZingTouchGestures, params?: any): MZingGesture {
        switch (gesture) {
            case 'tap':
                return new ZingTouch.Tap(params || {});
            case 'swipe':
                return new ZingTouch.Swipe(params || {});
            default: throw new Error(`ZingTouchUtil: Unrecognized gesture ${gesture}.`);
        }
    }
}

export class MZingTouchUtil {
    public GestureFactory = new MZingTouchGestureFactory();

    setupRegion(element: HTMLElement, capture: boolean = true, preventDefault: boolean = true): MZingRegion {
        element.style.touchAction = '';
        return new ZingTouch.Region(element, capture, preventDefault);
    }

    detectDirection(event: CustomEvent, threshold: number = 0): MZingGestureDirections {
        const angle: number = event.detail.data[0].currentDirection;
        if ((angle >= 360 - threshold && angle <= 360) || (angle <= threshold && angle >= 0)) {
            event.detail.events.forEach(event => event.originalEvent.preventDefault());
            return MZingGestureDirections.Right;
        } else if (angle >= 180 - threshold && angle <= 180 + threshold) {
            event.detail.events.forEach(event => event.originalEvent.preventDefault());
            return MZingGestureDirections.Left;
        }

        return MZingGestureDirections.None;
    }

    detectTap(event: CustomEvent): MZingTapInteractions {
        const interval: number = event.detail.interval;
        if (interval <= 5) {
            return MZingTapInteractions.Click;
        } else {
            return MZingTapInteractions.Tap;
        }
    }
}

export default new MZingTouchUtil();
