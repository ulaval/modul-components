import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import '../../utils/polyfills';
import { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { SCROLL_TOP_NAME } from '../component-names';
import { MScrollTop, MScrollTopPosition } from './scroll-top';

const REF_SCROLL_BUTTON: RefSelector = { ref: 'scrollButton' };

let wrapper: Wrapper<MScrollTop>;

let position: string;
let duration: ScrollToDuration;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MScrollTop, {
        mocks: {
            $modul: {
                event: {
                    $on: jest.fn()
                }
            },
            $scrollTo: {
                goToTop: jest.fn((duration: ScrollToDuration) => { })
            }
        },
        propsData: {
            position,
            duration
        }
    });
};

describe(SCROLL_TOP_NAME, () => {

    describe(`When loading with position fixed.`, () => {
        beforeEach(() => {
            initializeShallowWrapper();
        });
        it(`Should render correctly.`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
        it(`Then the position is fixed.`, () => {
            expect(wrapper.vm.isPositionFixed).toBeTruthy();
        });
        it(`Then scroll button is hidden.`, () => {
            expect(wrapper.find(REF_SCROLL_BUTTON).exists()).toBeFalsy();
        });
        describe(`When calling event of scroll.`, () => {
            beforeEach(() => {
                wrapper.setData({ scrollTopBreakPoint: -1 });
            });
            it(`Then scroll button is show.`, async () => {
                await wrapper.vm.onScroll();
                expect(wrapper.find(REF_SCROLL_BUTTON).exists()).toBeTruthy();
            });
        });
    });

    describe(`When loading with position relative.`, () => {
        beforeEach(() => {
            position = MScrollTopPosition.Relative;
            initializeShallowWrapper();
        });
        it('Should render correctly.', () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then position is relative.`, () => {
            expect(wrapper.vm.isPositionFixed).toBeFalsy();
        });

        it(`Then scroll button is show.`, () => {
            expect(wrapper.find(REF_SCROLL_BUTTON)).toBeTruthy();
        });

        describe(`When scroll button is clicked. `, () => {
            beforeEach(() => {
                wrapper.find(REF_SCROLL_BUTTON).trigger('click');
            });
            it(`Then action goToTop is call with an animation of regular duration.`, () => {
                expect(wrapper.vm.$scrollTo.goToTop).toHaveBeenLastCalledWith(ScrollToDuration.Regular);
            });

            describe(`When duration is Long`, () => {
                beforeEach(() => {
                    wrapper.setProps({ duration: ScrollToDuration.Long });
                    wrapper.find(REF_SCROLL_BUTTON).trigger('click');
                });
                it(`Then action goToTop is call with an animation of long duration.`, () => {
                    expect(wrapper.vm.$scrollTo.goToTop).toHaveBeenLastCalledWith(ScrollToDuration.Long);
                });
            });
        });

    });

});
