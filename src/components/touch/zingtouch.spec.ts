import ZingTouch from 'zingtouch';

import { MZingGestureDirections, MZingTouchGestures } from './enums';
import { MZingGesture, MZingTouchGestureFactory, MZingTouchUtil } from './zingtouch';

describe('MZingTouchGestureFactory', () => {
    let factory: MZingTouchGestureFactory = undefined;

    beforeEach(() => {
        factory = new MZingTouchGestureFactory();
    });

    it('it should return tap gesture when asked for it', () => {
        const gesture: MZingGesture = factory.getGesture(MZingTouchGestures.Tap);

        expect(gesture).toEqual(new ZingTouch.Tap());
    });

    it('it should return swipe gesture when asked for it', () => {
        const gesture: MZingGesture = factory.getGesture(MZingTouchGestures.Swipe);

        expect(gesture).toEqual(new ZingTouch.Swipe());
    });
});

describe('MZingTouchUtil', () => {
    let util: MZingTouchUtil = undefined;

    beforeEach(() => {
        util = new MZingTouchUtil();
    });

    it('it should be initialized correctly', () => {
        expect(util.GestureFactory).toEqual(new MZingTouchGestureFactory());
    });

    [
        { angle: 1, result: MZingGestureDirections.None },
        { angle: 0, result: MZingGestureDirections.Right },
        { angle: -1, result: MZingGestureDirections.None },
        { angle: 361, result: MZingGestureDirections.None },
        { angle: 360, result: MZingGestureDirections.Right },
        { angle: 359, result: MZingGestureDirections.None },
        { angle: 181, result: MZingGestureDirections.None },
        { angle: 180, result: MZingGestureDirections.Left },
        { angle: 179, result: MZingGestureDirections.None }
    ].forEach(keyValue => {
        it(`it should detect directions ${keyValue.result} when angle is ${ keyValue.angle } and threshold is 0`, () => {
            const direction: MZingGestureDirections = util.detectDirection({ detail: { data: [{ currentDirection: keyValue.angle }], events: [] } } as any);

            expect(direction).toBe(keyValue.result);
        });
    });

    [
        { angle: -1, result: MZingGestureDirections.None },
        { angle: 0, result: MZingGestureDirections.Right },
        { angle: 5, result: MZingGestureDirections.Right },
        { angle: 6, result: MZingGestureDirections.None },
        { angle: 361, result: MZingGestureDirections.None },
        { angle: 360, result: MZingGestureDirections.Right },
        { angle: 355, result: MZingGestureDirections.Right },
        { angle: 354, result: MZingGestureDirections.None },
        { angle: 186, result: MZingGestureDirections.None },
        { angle: 185, result: MZingGestureDirections.Left },
        { angle: 180, result: MZingGestureDirections.Left },
        { angle: 175, result: MZingGestureDirections.Left },
        { angle: 174, result: MZingGestureDirections.None }
    ].forEach(keyValue => {
        it(`it should detect directions ${keyValue.result} when angle is ${ keyValue.angle } and threshold is 5`, () => {
            const direction: MZingGestureDirections = util.detectDirection({ detail: { data: [{ currentDirection: keyValue.angle }], events: [] } } as any, 5);

            expect(direction).toBe(keyValue.result);
        });
    });

    // The rest of the code is untestable
});
