import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import ButtonPlugin from '../../components/button/button';
import ModulPlugin from '../../utils/modul/modul';
import ToggleButtonsPlugin, { MToggleButton, MToggleButtons } from './toggle-buttons';

let wrapper: Wrapper<MToggleButtons>;
let localVue: VueConstructor<Vue>;

let buttons: MToggleButton[] = [];
let multiple: boolean;
let disabled: boolean;

const BTN_A: MToggleButton = { id: 'a', title: 'A' };
const BTN_B: MToggleButton = { id: 'b', title: 'B' };
const BTN_C: MToggleButton = { id: 'c', title: 'C' };
const BTN_D: MToggleButton = { id: 'd', title: 'D' };
const BTN_E: MToggleButton = { id: 'e', title: 'E' };

const CLASS_BTN_PRIMARY: string = 'm--is-skin-primary';
const CLASS_BTN_SECONDARY: string = 'm--is-skin-secondary';

const initializeWrapper: () => any = () => {
    wrapper = mount(MToggleButtons, {
        localVue: localVue,
        propsData: {
            buttons,
            multiple,
            disabled
        }
    });
};

beforeEach(() => {
    wrapper = undefined as any;
});

describe('MToggleButtons', () => {
    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        localVue.use(ModulPlugin);
        Vue.use(ToggleButtonsPlugin);
        Vue.use(ButtonPlugin);
    });

    describe(`Given no button`, () => {

        beforeEach(() => {
            initializeWrapper();
        });

        it(`Then no buttons should be displayed`, () => {
            expect(wrapper.vm.$refs.toggle).toBeTruthy();
            expect(wrapper.findAll('.m-toggle-buttons__button').length).toEqual(0);
        });
    });

    describe(`Given 5 buttons and multiple selection allow`, () => {

        beforeEach(() => {
            buttons = [BTN_A, BTN_B, BTN_C, BTN_D, BTN_E];
            multiple = true;
            initializeWrapper();
        });

        it(`Then 5 buttons should be displayed`, () => {
            expect(wrapper.vm.$refs.toggle).toBeTruthy();
            expect(wrapper.findAll('.m-toggle-buttons__button').length).toEqual(5);
        });

        it(`Then no button should be pressed`, () => {
            expect(wrapper.findAll('.CLASS_BTN_PRIMARY').length).toEqual(0);
        });

        describe(`When the first button is clicked`, () => {
            it(`Should emit a change event and prop 'button' is updated on first button`, () => {
                wrapper.findAll('.m-toggle-buttons__button').at(0).trigger('click');
                expect(wrapper.emitted('change')).toEqual([[[{ ...BTN_A, pressed: true }, BTN_B, BTN_C, BTN_D, BTN_E]]]);
            });
        });

        describe(`When second button is clicked`, () => {
            beforeEach(() => {
                buttons = [{ ...BTN_A, pressed: true }, BTN_B, BTN_C, BTN_D, BTN_E];
                multiple = true;
                initializeWrapper();
            });
            it(`Should emit a change event and prop 'buttons' is updated on 2 first buttons`, () => {
                wrapper.findAll('.m-toggle-buttons__button').at(1).trigger('click');
                expect(wrapper.emitted('change')).toEqual([[[{ ...BTN_A, pressed: true }, { ...BTN_B, pressed: true }, BTN_C, BTN_D, BTN_E]]]);
            });
        });
    });

    describe(`Given 5 buttons and multiple selection not allow`, () => {

        beforeEach(() => {
            buttons = [BTN_A, BTN_B, BTN_C, BTN_D, BTN_E];
            multiple = false;
            initializeWrapper();
        });

        it(`Then 5 buttons should be displayed`, () => {
            expect(wrapper.vm.$refs.toggle).toBeTruthy();
            expect(wrapper.findAll('.m-toggle-buttons__button').length).toEqual(5);
        });

        it(`Then no button should be pressed`, () => {
            expect(wrapper.findAll('.CLASS_BTN_PRIMARY').length).toEqual(0);
        });

        describe(`When the first button is clicked`, () => {
            it(`Should emit a change event and prop 'buttons' is updated on first button`, () => {
                wrapper.findAll('.m-toggle-buttons__button').at(0).trigger('click');
                expect(wrapper.emitted('change')).toEqual([[[{ ...BTN_A, pressed: true }, { ...BTN_B, pressed: false }, { ...BTN_C, pressed: false }, { ...BTN_D, pressed: false }, { ...BTN_E, pressed: false }]]]);
            });
        });

        describe(`When second button is clicked`, () => {
            beforeEach(() => {
                buttons = [{ ...BTN_A, pressed: true }, BTN_B, BTN_C, BTN_D, BTN_E];
                multiple = false;
                initializeWrapper();
            });
            it(`Should emit a change event and prop 'button' is updated, first button is unpressed and second button is pressed`, () => {
                wrapper.findAll('.m-toggle-buttons__button').at(1).trigger('click');
                expect(wrapper.emitted('change')).toEqual([[[{ ...BTN_A, pressed: false }, { ...BTN_B, pressed: true }, { ...BTN_C, pressed: false }, { ...BTN_D, pressed: false }, { ...BTN_E, pressed: false }]]]);
            });
        });

    });

    describe(`Given toggle-button disabled`, () => {

        beforeEach(() => {
            buttons = [BTN_A, BTN_B];
            multiple = false;
            disabled = true;
            initializeWrapper();
        });

        it(`Then buttons should be disabled`, () => {
            expect(wrapper.vm.$refs.toggle).toBeTruthy();
            expect(wrapper.findAll('.m-toggle-buttons__button').at(0).props().disabled).toBeTruthy();
            expect(wrapper.findAll('.m-toggle-buttons__button').at(1).props().disabled).toBeTruthy();
        });
    });
});
