import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { MAvatar } from './avatar';

const REF_AVATAR: RefSelector = { ref: 'avatar' };

let wrapper: Wrapper<MAvatar>;
let propsClickable: boolean = false;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MAvatar, {
        propsData: {
            clickable: propsClickable
        }
    });
};

describe('MAvatar', () => {

    beforeEach(() => {
        propsClickable = false;
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

    describe(`When mouseover`, () => {
        it(`should call mouseOver()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ onMouseOver: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseover');

            expect(wrapper.vm.onMouseOver).toHaveBeenCalledTimes(1);
        });
    });

    describe(`When mouseleave`, () => {
        it(`should call mouseLeave()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ onMouseLeave: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseleave');

            expect(wrapper.vm.onMouseLeave).toHaveBeenCalledTimes(1);
        });
    });

});

