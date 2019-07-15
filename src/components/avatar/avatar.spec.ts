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

            wrapper.setMethods({ click: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('click');

            expect(wrapper.vm.click).toHaveBeenCalled();
        });

        describe(`and clickable = true`, async () => {
            it(`should emit click`, () => {
                propsClickable = true;
                initializeShallowWrapper();

                wrapper.vm.click();

                expect(wrapper.emitted('click')).toBeDefined();
            });
        });

        describe(`and clickable = false`, async () => {
            it(`should not emit click`, () => {
                propsClickable = false;
                initializeShallowWrapper();

                wrapper.vm.click();

                expect(wrapper.emitted('click')).toBeUndefined();
            });
        });

    });

    describe(`When mouseover`, () => {
        it(`should call mouseOver()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ mouseOver: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseover');

            expect(wrapper.vm.mouseOver).toHaveBeenCalled();
        });
    });

    describe(`When mouseleave`, () => {
        it(`should call mouseLeave()`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ mouseLeave: jest.fn() });
            wrapper.find(REF_AVATAR).trigger('mouseleave');

            expect(wrapper.vm.mouseLeave).toHaveBeenCalled();
        });
    });

});

