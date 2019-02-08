import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { MInputGroup } from '../input-group/input-group';

describe(`MInputGroup`, () => {
    let wrapper: Wrapper<MInputGroup>;
    let legend: string;
    let visible: boolean;
    let disabled: boolean;
    let waiting: boolean;
    let readonly: boolean;
    let valid: boolean;
    let error: boolean;
    let errorMessage: string;
    let validMessage: string;
    let helperMessage: string;
    let displayValidation: boolean;

    beforeEach(() => {
        legend = undefined as any;
        visible = undefined as any;
        disabled = undefined as any;
        waiting = undefined as any;
        readonly = undefined as any;
        valid = undefined as any;
        error = undefined as any;
        errorMessage = undefined as any;
        validMessage = undefined as any;
        helperMessage = undefined as any;
        displayValidation = undefined as any;

    });

    const initialiserWrapper: Function = (): void => {
        wrapper = mount(MInputGroup, {
            localVue: Vue,
            propsData: {
                legend,
                visible,
                disabled,
                waiting,
                readonly,
                valid,
                error,
                errorMessage,
                validMessage,
                helperMessage,
                displayValidation
            },
            scopedSlots: {
                default: '<div slot-scope="result">{{ result.disabled }} {{ result.error }} {{ result.valid }} {{ result.readonly }} {{ result.validationMessage }}</div>'
            }
        });
    };

    describe(`with default values`, () => {
        beforeEach(() => {
            initialiserWrapper();
        });

        it(`will render correctly`, async () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

    });

    describe(`with all props defined`, () => {
        beforeEach(() => {
            legend = 'Some legend';
            visible = true;
            disabled = true;
            waiting = true;
            readonly = true;
            valid = true;
            error = true;
            errorMessage = 'Some error message';
            validMessage = 'Some valid message';
            helperMessage = 'Some helper message';
            displayValidation = true;
            initialiserWrapper();
        });

        it(`will render correctly`, async () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`when setting visiblity to false`, () => {
            beforeEach(() => {
                visible = false;
                displayValidation = false;
                initialiserWrapper();
            });

            it(`will render correctly`, async () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`when removing legend`, () => {
            beforeEach(() => {
                legend = '';
                initialiserWrapper();
            });

            it(`will render correctly`, async () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
    });
});
