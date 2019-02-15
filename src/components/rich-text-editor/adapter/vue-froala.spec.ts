import { mount, Wrapper } from '@vue/test-utils';
import $ from 'jquery';
import { VueFroala } from './vue-froala';


let wrapper: Wrapper<VueFroala>;
let froala: any;

// mock froala editor
$.FroalaEditor = {
    DefineIcon: jest.fn(),
    DefineIconTemplate: jest.fn(),
    POPUP_TEMPLATES: {},
    PLUGINS: {},
    RegisterCommand: jest.fn()
};

describe('VueFroala', () => {
    beforeEach(() => {
        wrapper = mount(VueFroala);
        froala = wrapper.vm;
    });

    it('should be empty', () => {
        expect(froala.isEmpty).toBeTruthy();
    });
});
