import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { MZingGestureDirections, MZingTapInteractions, MZingTouchGestures } from './enums';
import { MTouch, MTouchSwipeDirection, MTouchSwipeOptions } from './touch';
import ZingTouchUtil, { MZingGesture, MZingGestureCallback, MZingRegion } from './zingtouch';


let mockZingRegion: MZingRegion = { bind: jest.fn(), unbind: jest.fn() };
jest.mock('./zingtouch', () => ({
    setupRegion: () => mockZingRegion,
    GestureFactory: {
        getGesture: jest.fn()
    },
    detectDirection: jest.fn(),
    detectTap: jest.fn()
}));

describe('MTouch', () => {
    let wrapper: Wrapper<MTouch> | undefined = undefined;
    let localVue: VueConstructor<Vue>;
    let swipeOptions: MTouchSwipeOptions | undefined = undefined;

    let mountComponent: () => void = () => {
        wrapper = mount(MTouch, {
            localVue,
            propsData: { swipeOptions }
        });
    };

    beforeEach(() => {
        localVue = createLocalVue();
        swipeOptions = {
            direction: 'both' as any,
            angleThreshold: 999,
            velocity: 999
        };
    });

    it('should setup zing region correctly when mounting', () => {
        jest.spyOn(ZingTouchUtil, 'setupRegion');

        mountComponent();

        expect(ZingTouchUtil.setupRegion).toHaveBeenCalledWith(wrapper!.vm.$el, false, false);
    });

    it('should bind swipe correctly when mounting when swipe options are provided', () => {
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'swipe' ? 'swipeGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Swipe, swipeOptions);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper!.vm.$el, 'swipeGesture', expect.anything());
    });

    it('should bind swipe correctly when mounting when swipe options are not provided', () => {
        swipeOptions = undefined;
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'swipe' ? 'swipeGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        const expectedSwipeOptions: MTouchSwipeOptions = { angleThreshold: 20, direction: MTouchSwipeDirection.both, velocity: 0.3 };
        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Swipe, expectedSwipeOptions);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper!.vm.$el, 'swipeGesture', expect.anything());
    });

    it('should bind tap correctly when mounting', () => {
        jest.spyOn(mockZingRegion, 'bind');
        (ZingTouchUtil.GestureFactory.getGesture as jest.Mock).mockImplementation((gesture: string) => gesture === 'tap' ? 'tapGesture' : '');
        jest.spyOn(ZingTouchUtil.GestureFactory, 'getGesture');

        mountComponent();

        expect(ZingTouchUtil.GestureFactory.getGesture).toHaveBeenCalledWith(MZingTouchGestures.Tap);
        expect(mockZingRegion.bind).toHaveBeenCalledWith(wrapper!.vm.$el, 'tapGesture', expect.anything());
    });

    describe('swipe', () => {
        let swipeCallback: MZingGestureCallback | undefined;
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

        [MZingGestureDirections.Left, MZingGestureDirections.Right].forEach((direction: MZingGestureDirections) => {
            it(`should handle swipe${direction} when provided swipe direction is both`, () => {
                const fakeEventObject: any = { detail: 'someDetail', stopPropagation: jest.fn() };
                jest.spyOn(fakeEventObject, 'stopPropagation');
                swipeOptions!.direction = MTouchSwipeDirection.both;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => direction);

                mountComponent();
                if (swipeCallback) {
                    swipeCallback(fakeEventObject);
                }


                expect(wrapper!.emitted(`swipe${direction}`.toLowerCase())[0][0]).toBeDefined();
                expect(fakeEventObject.stopPropagation).toHaveBeenCalled();
            });

            it(`should handle swipe${direction} when provided swipe direction is horizontal`, () => {
                const fakeEventObject: any = { detail: 'someDetail', stopPropagation: jest.fn() };
                jest.spyOn(fakeEventObject, 'stopPropagation');
                swipeOptions!.direction = MTouchSwipeDirection.horizontal;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => direction);

                mountComponent();
                if (swipeCallback) {
                    swipeCallback(fakeEventObject);
                }


                expect(wrapper!.emitted(`swipe${direction}`.toLowerCase())[0][0]).toBeDefined();
                expect(fakeEventObject.stopPropagation).toHaveBeenCalled();
            });

            it(`should handle swipe${direction} when provided swipe direction is vertical`, () => {
                const fakeEventObject: any = { detail: 'someDetail', stopPropagation: jest.fn() };
                jest.spyOn(fakeEventObject, 'stopPropagation');
                swipeOptions!.direction = MTouchSwipeDirection.vertical;
                (ZingTouchUtil.detectDirection as jest.Mock).mockImplementation(() => direction);

                mountComponent();
                if (swipeCallback) {
                    swipeCallback(fakeEventObject);
                }

                expect(wrapper!.emitted(`swipe${direction}`.toLowerCase())).toBeUndefined();
                expect(fakeEventObject.stopPropagation).not.toHaveBeenCalled();
            });
        });
    });

    describe('tap', () => {
        let tapcallback: MZingGestureCallback | undefined;
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

        it(`should handle tap when detected tap is a tap`, () => {
            const fakeEventObject: any = { detail: 'someDetail', stopPropagation: jest.fn() };
            jest.spyOn(fakeEventObject, 'stopPropagation');
            (ZingTouchUtil.detectTap as jest.Mock).mockImplementation(() => MZingTapInteractions.Tap);

            mountComponent();
            if (tapcallback) {
                tapcallback(fakeEventObject);
            }


            expect(wrapper!.emitted('tap')).toBeDefined();
            expect(fakeEventObject.stopPropagation).toHaveBeenCalled();
        });

        it(`should handle tap when detected tap is a click`, () => {
            const fakeEventObject: any = { detail: 'someDetail', stopPropagation: jest.fn() };
            jest.spyOn(fakeEventObject, 'stopPropagation');
            (ZingTouchUtil.detectTap as jest.Mock).mockImplementation(() => MZingTapInteractions.Click);

            mountComponent();
            if (tapcallback) {
                tapcallback(fakeEventObject);
            }

            expect(wrapper!.emitted('click')).toBeDefined();
            expect(fakeEventObject.stopPropagation).toHaveBeenCalled();
        });
    });
});
