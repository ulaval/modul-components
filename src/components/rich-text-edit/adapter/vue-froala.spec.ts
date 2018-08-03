import $ from 'jquery';

import { shallow, Wrapper } from '../../../../node_modules/@vue/test-utils';
import { VueFroala } from './vue-froala';

let wrapper: Wrapper<VueFroala>;
let froala: any;

// mock froala editor
$.FroalaEditor = {
    DefineIcon: jest.fn(),
    POPUP_TEMPLATES: {},
    PLUGINS: {},
    RegisterCommand: jest.fn()
};

describe('VueFroala', () => {
    beforeEach(() => {
        wrapper = shallow(VueFroala);
        froala = wrapper.vm;
    });

    it('should be empty', () => {
        expect(froala.isEmpty).toBeTruthy();
    });

    describe('When adding value',() => {
        const newValue: string = 'test';
        beforeEach(() => {
            wrapper.setProps({
                value: newValue
            });
        });

        it('should update the model', () => {
            expect(froala.model).toEqual(newValue);
        });

        it('should not be empty', () => {
            expect(froala.isEmpty).toBeFalsy();
        });
    });
});
