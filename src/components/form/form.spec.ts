// tslint:disable:no-big-function

import { createLocalVue, mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FieldValidationCallback, FormField } from '../../utils/form/form-field/form-field';
import FormPlugin, { MForm } from './form';

let mockForm: any = {};
jest.mock('../../utils/form/form', () => {
    return {
        Form: jest.fn().mockImplementation(() => {
            return mockForm;
        })
    };
});

let HTML_ELEMENT: HTMLElement;
const ERROR_MESSAGE: string = 'ERROR';
const ERROR_MESSAGE_SUMMARY: string = 'ERROR MESSAGE SUMMARY';
const REF_SUMMARY: RefSelector = { ref: 'summary' };

let fieldValidation: FormFieldValidation = new FormFieldValidation();

let FORM: Form;
let formHasError: boolean = false;
let nbFieldsThatHasError: number = 0;
let nbOfErrors: number = 0;
let mockGetErrorsForSummary: jest.Mock = jest.fn(() => []);

describe(`MForm`, () => {
    let wrapper: Wrapper<MForm>;
    let localVue: VueConstructor<Vue>;

    const initialiserWrapper: Function = (): void => {
        wrapper = mount(MForm, {
            localVue: localVue,
            propsData: {
                form: FORM
            }
        });
    };

    const initialiseForm: Function = (multiple: boolean): void => {
        const VALIDATION_FUNCTION: FieldValidationCallback<string> = (): FormFieldValidation => fieldValidation;
        if (multiple) {
            FORM = new Form({
                'a-field': new FormField((): string => '', [VALIDATION_FUNCTION]),
                'another-field': new FormField((): string => '', [VALIDATION_FUNCTION])
            });
        } else {
            FORM = new Form({
                'a-field': new FormField((): string => '', [VALIDATION_FUNCTION])
            });
        }
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(FormPlugin);
        mockForm = {
            id: 'uuid',
            hasError: formHasError,
            reset: jest.fn(),
            nbFieldsThatHasError,
            nbOfErrors,
            getErrorsForSummary: mockGetErrorsForSummary,
            focusFirstFieldWithError: jest.fn(),
            validateAll: jest.fn()
        };
        ((Form as unknown) as jest.Mock).mockClear();
        initialiseForm();
        initialiserWrapper();
    });

    it(`should render correctly`, async () => {
        expect(await renderComponent(wrapper.vm)).toMatchSnapshot();
    });

    it(`When the form has required fields, then it should show a required label`, async () => {
        wrapper.setProps({ requiredMarker: true });
        expect(await renderComponent(wrapper.vm)).toMatchSnapshot();
    });

    it(`When the form has no required fields, then it should not show a required label`, async () => {
        wrapper.setProps({ requiredMarker: false });
        expect(await renderComponent(wrapper.vm)).toMatchSnapshot();
    });

    describe(`Given a submit event is triggered`, () => {
        describe(`When there are no errors`, () => {
            it(`Then the submit callback is executed`, () => {
                const onSubmitMock: jest.Mock = jest.fn();
                wrapper.setMethods({ onSubmit: onSubmitMock });

                wrapper.trigger('submit');

                expect(onSubmitMock).toHaveBeenCalledTimes(1);
            });
        });

        describe(`When there is one error`, () => {
            beforeEach(() => {
                nbFieldsThatHasError = 1;
                mockGetErrorsForSummary = jest.fn(() => {
                    return [ERROR_MESSAGE_SUMMARY];
                });
                initialiseForm();
                initialiserWrapper();
            });

            it(`Then the summary of errors is not shown`, async () => {
                wrapper.trigger('submit');

                expect(wrapper.find(REF_SUMMARY).exists()).toBeFalsy();
            });

            it(`Then it focuses on the first error`, () => {
                wrapper.trigger('submit');

                expect(mockForm.focusFirstFieldWithError).toHaveBeenCalledTimes(1);
            });

            it(`Then the submit event is not sent to the parent`, () => {
                wrapper.trigger('submit');

                expect(wrapper.emitted('submit')).toBeFalsy();
            });
        });

        describe(`When there are multiple errors`, () => {
            beforeEach(() => {
                nbFieldsThatHasError = 2;
                mockGetErrorsForSummary = jest.fn(() => {
                    return [ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE_SUMMARY];
                });
                initialiseForm(true);
                initialiserWrapper();
                wrapper.trigger('submit');
            });

            it(`Then the submit event is not sent to the parent`, () => {
                expect(wrapper.emitted('submit')).toBeFalsy();
            });

            it(`Then the summary of errors is shown`, async () => {
                expect(wrapper.find(REF_SUMMARY).exists()).toBeTruthy();
            });
        });
    });

    describe(`When the reset event is triggered`, () => {
        it(`Then the reset event is sent to the parent`, () => {
            wrapper.trigger('reset');

            expect(wrapper.emitted('reset')).toBeTruthy();
        });

        it(`Then the form no longer contains errors`, () => {
            wrapper.setData({ erreurs: ['', ''] });
            wrapper.trigger('reset');

            expect(wrapper.vm.errors).toHaveLength(0);
        });

        it(`Then the reset callback is executed`, () => {
            const onResetMock: jest.Mock = jest.fn();
            wrapper.setMethods({ onReset: onResetMock });

            wrapper.trigger('reset');

            expect(onResetMock).toHaveBeenCalledTimes(1);
        });
    });
});
