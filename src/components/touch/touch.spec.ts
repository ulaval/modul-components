import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { MZingGestureDirections, MZingTouchGestures } from './enums';
import { MTouch, MTouchSwipeDirection, MTouchSwipeOptions } from './touch';
import ZingTouchUtil, { MZingGesture, MZingGestureCallback, MZingRegion } from './zingtouch';

let mockZingRegion: MZingRegion = { bind: jest.fn(), unbind: jest.fn() };
jest.mock('./zingtouch', () => ({
    setupRegion: () => mockZingRegion,
    GestureFactory: {
        getGesture: jest.fn()
    },
    detectDirection: jest.fn()
}));

describe('MTouch', () => {
    let wrapper: Wrapper<MTouch> = undefined;
    let localVue: VueConstructor<Vue>;
    let swipeOptions: MTouchSwipeOptions = undefined;

    let mountComponent: () => void = () => {
        wrapper = mount(MTouch, {
            localVue,
            propsData: { swipeOptions }
        });
    };

    beforeEach(() => {
        localVue = createLocalVue();
        swipeOptions = {
            direction: MTouchSwipeDirection.both,
            angleThreshold: 999,
            velocity: 999
        };
    });

    it('should setup zing region correctly when mounting', () => {
        jest.spyOn(ZingTouchUtil, 'setupRegion');

        mountComponent();

        expect(ZingTouchUtil.setupRegion).toHaveBeenCalledWith(wrapper.vm.$el, false, false);
    });

    it('should bind swipe correctly when mounting when swipe options are provided', () => {
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'swipe' ? 'swipeGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Swipe, swipeOptions);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper.vm.$el, 'swipeGesture', expect.anything());
    });

    it('should bind swipe correctly when mounting when swipe options are not provided', () => {
        swipeOptions = undefined;
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'swipe' ? 'swipeGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        const expectedSwipeOptions: MTouchSwipeOptions = { angleThreshold: 20, direction: 2, velocity: 0.3 };
        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Swipe, expectedSwipeOptions);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper.vm.$el, 'swipeGesture', expect.anything());
    });

    it('should bind tap correctly when mounting', () => {
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'tap' ? 'tapGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Tap);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper.vm.$el, 'tapGesture', expect.anything());
    });

    describe('swipe', () => {
        let swipeCallback: MZingGestureCallback;
        beforeEach(() => {
            swipeCallback = undefined;
            (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => {
                return gesture === 'tap' ? 'tapGesture' : 'swipeGesture';
            });

            (mockZingRegion.bind as jest.Mock).mockImplementation((_element: HTMLElement, gesture: MZingGesture, callback: MZingGestureCallback) => {
                if (gesture === 'swipeGesture') {
                    swipeCallback = callback;
                }
            });
        });

        [MTouchSwipeDirection.both, MTouchSwipeDirection.horizontal].forEach((providedSwipeDirection) => {
            it(`should emit swiperight when provided swipe direction is ${providedSwipeDirection}`, () => {
                const fakeEventObject: any = { detail: 'someDetail' };
                swipeOptions.direction = providedSwipeDirection;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => MZingGestureDirections.Right);

                mountComponent();
                swipeCallback(fakeEventObject as any);

                expect(wrapper.emitted('swiperight')[0][0]).toBeDefined();
            });

            it(`should not emit swiperight when provided swipe direction is vertical`, () => {
                const fakeEventObject: any = { detail: 'someDetail' };
                swipeOptions.direction = MTouchSwipeDirection.vertical;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => MZingGestureDirections.Right);

                mountComponent();
                swipeCallback(fakeEventObject as any);

                expect(wrapper.emitted('swiperight')).toBeUndefined();
            });

            it(`should emit swipeleft when provided swipe direction is ${providedSwipeDirection}`, () => {
                const fakeEventObject: any = { detail: 'someDetail' };
                swipeOptions.direction = providedSwipeDirection;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => MZingGestureDirections.Left);

                mountComponent();
                swipeCallback(fakeEventObject as any);

                expect(wrapper.emitted('swipeleft')[0][0]).toBeDefined();
            });

            it(`should not emit swiperight when provided swipe direction is vertical`, () => {
                const fakeEventObject: any = { detail: 'someDetail' };
                swipeOptions.direction = MTouchSwipeDirection.vertical;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => MZingGestureDirections.Left);

                mountComponent();
                swipeCallback(fakeEventObject as any);

                expect(wrapper.emitted('swipeleft')).toBeUndefined();
            });
        });
    });

    describe('swipe', () => {
        let tapcallback: MZingGestureCallback;
        beforeEach(() => {
            tapcallback = undefined;
            (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => {
                return gesture === 'tap' ? 'tapGesture' : 'swipeGesture';
            });

            (mockZingRegion.bind as jest.Mock).mockImplementation((_element: HTMLElement, gesture: MZingGesture, callback: MZingGestureCallback) => {
                if (gesture === 'tapGesture') {
                    tapcallback = callback;
                }
            });
        });

        it(`should emit tap`, () => {
            const fakeEventObject: any = { detail: 'someDetail' };

            mountComponent();
            tapcallback(fakeEventObject as any);

            expect(wrapper.emitted('tap')[0][0]).toBeDefined();
        });
    });
});
