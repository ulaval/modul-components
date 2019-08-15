import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { MAvatar } from './avatar';

const REF_AVATAR: RefSelector = { ref: 'avatar' };

let wrapper: Wrapper<MAvatar>;
let propsClickable: boolean = false;
let slotContent: string = '';

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MAvatar, {
        propsData: {
            clickable: propsClickable
        },
        mocks: {
            $modul: {
                event: {
                    $on: jest.fn(),
                    $off: jest.fn()
                }
            }
        },
        scopedSlots: {
            content: slotContent
        }
    });
};

describe('MAvatar', () => {

    beforeEach(() => {
        propsClickable = false;
        slotContent = '';
    });

    describe(`When someone click on the avatar`, () => {

        it(`should call click()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ onClick: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('click');

            expect(wrapper.vm.onClick).toHaveBeenCalledTimes(1);
        });

        describe(`and clickable = true`, async () => {
            it(`should emit click`, () => {
                propsClickable = true;
                initializeShallowWrapper();

                wrapper.vm.onClick();

                expect(wrapper.emitted('click')).toBeDefined();
            });
        });

        describe(`and clickable = false`, async () => {
            it(`should not emit click`, () => {
                propsClickable = false;
                initializeShallowWrapper();

                wrapper.vm.onClick();

                expect(wrapper.emitted('click')).toBeUndefined();
            });
        });

    });

    describe(`When keydown.enter`, () => {
        it(`should call onClick()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ onClick: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('keydown.enter');

            expect(wrapper.vm.onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe(`When keyup.tab.enter`, () => {
        it(`should call focusDisplay(true)`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ focusDisplay: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('keyup.tab');

            expect(wrapper.vm.focusDisplay).toHaveBeenCalledWith(true);
        });
    });

    describe(`When mouseover`, () => {
        it(`hover = true`, () => {
            initializeShallowWrapper();
            wrapper.vm.hover = false;

            wrapper.setMethods({ setHover: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseover');

            expect(wrapper.vm.hover).toBe(true);
        });
    });

    describe(`When mouseleave`, () => {
        it(`hover = false`, () => {
            initializeShallowWrapper();
            wrapper.vm.hover = true;

            wrapper.setMethods({ setHover: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseleave');

            expect(wrapper.vm.hover).toBe(false);
        });
    });

    describe(`When focus`, () => {
        it(`should call setHover(true)`, () => {
            initializeShallowWrapper();
            wrapper.vm.hover = false;

            wrapper.setMethods({ setHover: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('focus');

            expect(wrapper.vm.hover).toBe(true);
        });
    });

    describe(`When blur`, () => {
        it(`should call setHover(false)`, () => {
            initializeShallowWrapper();
            wrapper.vm.hover = true;

            wrapper.setMethods({ setHover: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('blur');

            expect(wrapper.vm.hover).toBe(false);
        });
    });

    describe(`When touchend`, () => {
        it(`should call onTouchend()`, () => {
            propsClickable = false;
            initializeShallowWrapper();

            wrapper.setMethods({ onTouchend: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('touchend');

            expect(wrapper.vm.onTouchend).toHaveBeenCalledTimes(1);
        });

        describe(`when clickable = true`, () => {

            beforeEach(() => {
                propsClickable = true;
            });

            describe(`and there's no content slot`, () => {
                it(`should emit touch`, () => {
                    initializeShallowWrapper();

                    wrapper.vm.onTouchend();

                    expect(wrapper.emitted('touch')).toBeUndefined();
                });
            });

            describe('with a content slot', () => {
                describe(`and the avatar is not touched`, () => {
                    it(`should not emit touch`, () => {
                        slotContent = '<div class="content-slot" />';
                        initializeShallowWrapper();

                        wrapper.vm.isTouched = false;
                        wrapper.vm.onTouchend();

                        expect(wrapper.emitted('touch')).toBeUndefined();
                    });
                });

                describe(`and the avatar is touched`, () => {
                    it(`should emit touch`, () => {
                        initializeShallowWrapper();
                        wrapper.vm.isTouched = true;

                        wrapper.vm.onTouchend();

                        expect(wrapper.emitted('touch')).toBeDefined();
                    });
                });
            });
        });

        describe(`when clickable = false`, () => {
            it(`should not emit touch`, () => {
                initializeShallowWrapper();
                wrapper.vm.onTouchend();

                expect(wrapper.emitted('touch')).toBeUndefined();
            });
        });
    });

});

