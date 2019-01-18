// tslint:disable:no-big-function

import { createLocalVue, mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { Form } from '../../utils/form/form';
import { FormFieldState } from '../../utils/form/form-field-state/form-field-state';
import { FormField } from '../../utils/form/form-field/form-field';
import uuid from '../../utils/uuid/uuid';
import FormPlugin, { MForm } from './form';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const ERROR_MESSAGE: string = 'ERROR';
const ERROR_MESSAGE_SUMMARY: string = 'ERROR MESSAGE SUMMARY';
const REF_SUMMARY: RefSelector = { ref: 'summary' };
const FORM: Form = new Form([
    new FormField((): string => '', (): FormFieldState => new FormFieldState())
]);

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

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(FormPlugin);
        initialiserWrapper();
    });

    it(`should render correctly`, async () => {
        expect(await renderComponent(wrapper.vm)).toMatchSnapshot();
    });

    it(`When the form has required fields, then it should show a required label`, async () => {
        wrapper.setProps({ hasRequiredFields: true });
        expect(await renderComponent(wrapper.vm)).toMatchSnapshot();
    });

    it(`When the form has no required fields, then it should not show a required label`, async () => {
        wrapper.setProps({ hasRequiredFields: false });
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
                wrapper.setProps({
                    form: new Form([
                        new FormField((): string => '', (): FormFieldState => new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE))
                    ])
                });
                wrapper.trigger('submit');
            });

            it(`Then the submit event is not sent to the parent`, () => {
                expect(wrapper.emitted('submit')).toBeFalsy();
            });

            it(`Then the summary of errors is not shown`, async () => {
                expect(wrapper.find(REF_SUMMARY).exists()).toBeFalsy();
            });
        });

        describe(`When there are multiple errors`, () => {
            beforeEach(() => {
                wrapper.setProps({
                    form: new Form([
                        new FormField((): string => '', (): FormFieldState => new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE)),
                        new FormField((): string => '', (): FormFieldState => new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE))
                    ])
                });
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
