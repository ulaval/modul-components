// tslint:disable:no-big-function

import { createLocalVue, mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FieldValidationCallback, FormField } from '../../utils/form/form-field/form-field';
import { ToastService } from '../../utils/toast/toast-service';
import FormPlugin, { MForm } from './form';

let mockForm: any = {};
let mockToast: any = {};
jest.mock('../../utils/toast/toast-service', () => {
    return {
        ToastService: jest.fn().mockImplementation(() => {
            return mockToast;
        })
    };
});
jest.mock('../../utils/form/form', () => {
    return {
        Form: jest.fn().mockImplementation(() => {
            return mockForm;
        })
    };
});

describe(`MForm`, () => {
    const ERROR_MESSAGE_SUMMARY: string = 'ERROR MESSAGE SUMMARY';
    const REF_SUMMARY: RefSelector = { ref: 'summary' };

    let fieldValidation: FormFieldValidation;

    let FORM: Form;
    let formHasError: boolean = false;
    let nbFieldsThatHasError: number = 0;
    let nbOfErrors: number = 0;
    let totalNbofErrors: number = 0;
    let mockGetErrorsForSummary: jest.Mock = jest.fn(() => []);
    let isValid: boolean = true;
    let wrapper: Wrapper<MForm>;
    let localVue: VueConstructor<Vue>;

    const initialiserWrapper: Function = (): void => {
        wrapper = mount(MForm, {
            localVue: localVue,
            propsData: {
                form: FORM
            }
        });
        wrapper.vm.$toast = new ToastService();
    };

    const initialiseForm: Function = (multiple: boolean): void => {
        const VALIDATION_FUNCTION: FieldValidationCallback = (): FormFieldValidation => fieldValidation;
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
            totalNbofErrors,
            nbFieldsThatHasError,
            nbOfErrors,
            getErrorsForSummary: mockGetErrorsForSummary,
            focusFirstFieldWithError: jest.fn(),
            validateAll: jest.fn(),
            isValid
        };
        mockToast = {
            clear: jest.fn(),
            show: jest.fn()
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
        it(`Then it removes toasts`, () => {
            const spy: jest.SpyInstance = jest.spyOn(mockToast, 'clear');

            wrapper.trigger('submit');

            expect(spy).toHaveBeenCalledTimes(1);
        });

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
                isValid = false;
                totalNbofErrors = 1;
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

            it(`Then it does not show a toast`, () => {
                const spy: jest.SpyInstance = jest.spyOn(mockToast, 'show');

                wrapper.trigger('submit');

                expect(spy).toHaveBeenCalledTimes(0);
            });
        });

        describe(`When there are multiple errors`, () => {
            beforeEach(() => {
                isValid = false;
                totalNbofErrors = 2;
                nbFieldsThatHasError = 2;
                mockGetErrorsForSummary = jest.fn(() => {
                    return [ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE_SUMMARY];
                });
                initialiseForm(true);
                initialiserWrapper();
            });

            it(`Then the submit event is not sent to the parent`, () => {
                wrapper.trigger('submit');

                expect(wrapper.emitted('submit')).toBeFalsy();
            });

            it(`Then it focuses on the first error`, () => {
                wrapper.trigger('submit');

                expect(mockForm.focusFirstFieldWithError).toHaveBeenCalledTimes(1);
            });

            it(`Then the summary of errors is shown`, async () => {
                wrapper.trigger('submit');

                expect(wrapper.find(REF_SUMMARY).exists()).toBeTruthy();
            });

            it(`Then it shows a toast`, () => {
                const spy: jest.SpyInstance = jest.spyOn(mockToast, 'show');

                wrapper.trigger('submit');

                expect(spy).toHaveBeenCalledTimes(1);
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
