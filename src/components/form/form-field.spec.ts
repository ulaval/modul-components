import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FormField } from '../../utils/form/form-field/form-field';
import { ModulVue } from '../../utils/vue/vue';
import FormFieldDirectivePlugin from './form-field';

let mockFormField: any = {};

jest.mock('../../utils/form/form-field/form-field', () => {
    return {
        FormField: jest.fn().mockImplementation(() => {
            return mockFormField;
        })
    };
});
window.scrollTo = jest.fn();

describe('form-field', () => {
    let wrapper: Wrapper<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(FormFieldDirectivePlugin);
    });

    describe(`The form validate its fields`, () => {
        mockFormField = {
            shouldFocus: false,
            isTouched: false,
            hasError: true,
            touched: false,
            touch: jest.fn()
        };

        let formField: FormField<any>;
        let form: Form;

        beforeEach(() => {
            formField = new FormField(() => undefined, [(value: any) => {
                return new FormFieldValidation(true, [''], ['']);
            }]);

            form = new Form({
                'a-field': formField
            });

            wrapper = mount(
                {
                    template: `<input v-m-form-field="form.get('a-field')" ref="field"></input>`,
                    data(): any {
                        return {
                            form: form
                        };
                    }
                }, {
                    localVue: Vue
                }
            );
        });

        it(`the element should be scrolled to`, async () => {
            const spy: jest.SpyInstance = jest.spyOn((Vue.prototype).$scrollTo, 'goTo');
            form.focusFirstFieldWithError();
            expect(mockFormField.shouldFocus).toBe(true);

            await wrapper.vm.$forceUpdate();

            expect(spy).toHaveBeenCalledWith(wrapper.element, -200);
        });

        it(`the element should be focused`, async () => {
            const spy2: jest.SpyInstance = jest.spyOn(wrapper.find({ ref: 'field' }).element, 'focus');
            form.focusFirstFieldWithError();
            expect(mockFormField.shouldFocus).toBe(true);

            await wrapper.vm.$forceUpdate();

            expect(mockFormField.shouldFocus).toBe(false);
            expect(spy2).toHaveBeenCalled();
        });

        it(`it should touch the form field on blur`, () => {
            const spy2: jest.SpyInstance = jest.spyOn(mockFormField, 'touch');

            wrapper.find({ ref: 'field' }).element.focus();
            wrapper.find({ ref: 'field' }).element.blur();

            expect(spy2).toHaveBeenCalled();
        });
    });
});
