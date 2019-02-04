import ZingTouch from 'zingtouch';
import { MZingGestureDirections, MZingTapInteractions, MZingTouchGestures } from './enums';
import { MZingGesture, MZingTouchGestureFactory, MZingTouchUtil } from './zingtouch';


describe('MZingTouchGestureFactory', () => {
    let factory: MZingTouchGestureFactory | undefined = undefined;

    beforeEach(() => {
        factory = new MZingTouchGestureFactory();
    });

    it('it should return tap gesture when asked for it', () => {
        const gesture: MZingGesture = factory!.getGesture(MZingTouchGestures.Tap);

        expect(gesture).toEqual(new ZingTouch.Tap());
    });

    it('it should return swipe gesture when asked for it', () => {
        const gesture: MZingGesture = factory!.getGesture(MZingTouchGestures.Swipe);

        expect(gesture).toEqual(new ZingTouch.Swipe());
    });
});

describe('MZingTouchUtil', () => {
    let util: MZingTouchUtil | undefined = undefined;

    beforeEach(() => {
        util = new MZingTouchUtil();
    });

    it('it should be initialized correctly', () => {
        expect(util!.GestureFactory).toEqual(new MZingTouchGestureFactory());
    });

    // detectDirection limit cases test
    [
        { angle: 1, result: MZingGestureDirections.None, threshold: 0 },
        { angle: 0, result: MZingGestureDirections.Right, threshold: 0 },
        { angle: -1, result: MZingGestureDirections.None, threshold: 0 },
        { angle: 361, result: MZingGestureDirections.None, threshold: 0 },
        { angle: 360, result: MZingGestureDirections.Right, threshold: 0 },
        { angle: 359, result: MZingGestureDirections.None, threshold: 0 },
        { angle: 181, result: MZingGestureDirections.None, threshold: 0 },
        { angle: 180, result: MZingGestureDirections.Left, threshold: 0 },
        { angle: 179, result: MZingGestureDirections.None, threshold: 0 },
        { angle: -1, result: MZingGestureDirections.None, threshold: 5 },
        { angle: 0, result: MZingGestureDirections.Right, threshold: 5 },
        { angle: 5, result: MZingGestureDirections.Right, threshold: 5 },
        { angle: 6, result: MZingGestureDirections.None, threshold: 5 },
        { angle: 361, result: MZingGestureDirections.None, threshold: 5 },
        { angle: 360, result: MZingGestureDirections.Right, threshold: 5 },
        { angle: 355, result: MZingGestureDirections.Right, threshold: 5 },
        { angle: 354, result: MZingGestureDirections.None, threshold: 5 },
        { angle: 186, result: MZingGestureDirections.None, threshold: 5 },
        { angle: 185, result: MZingGestureDirections.Left, threshold: 5 },
        { angle: 180, result: MZingGestureDirections.Left, threshold: 5 },
        { angle: 175, result: MZingGestureDirections.Left, threshold: 5 },
        { angle: 174, result: MZingGestureDirections.None, threshold: 5 }
    ].forEach(keyValue => {
        it(`it should detect directions ${keyValue.result} when angle is ${keyValue.angle} and threshold is ${keyValue.threshold}`, () => {
            const direction: MZingGestureDirections = util!.detectDirection({ detail: { data: [{ currentDirection: keyValue.angle }], events: [] } } as any, keyValue.threshold);

            expect(direction).toBe(keyValue.result);
        });
    });

    [
        { interval: 0, result: MZingTapInteractions.Click },
        { interval: 4, result: MZingTapInteractions.Click },
        { interval: 5, result: MZingTapInteractions.Click },
        { interval: 6, result: MZingTapInteractions.Tap },
        { interval: 7, result: MZingTapInteractions.Tap },
        { interval: 10, result: MZingTapInteractions.Tap }
    ].forEach(keyValue => {
        it(`it should detect ${keyValue.result} when interval is ${keyValue.interval}`, () => {
            const interaction: MZingTapInteractions = util!.detectTap({ detail: { interval: keyValue.interval } } as CustomEvent);

            expect(interaction).toBe(keyValue.result);
        });
    });
});
