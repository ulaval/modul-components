import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import TextfieldPlugin from '../../components/textfield/textfield';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FormField } from '../../utils/form/form-field/form-field';
import { ModulVue } from '../../utils/vue/vue';
import FormFieldDirective from './form-field';

let mockFormField: any = {};

jest.mock('../../utils/form/form-field/form-field', () => {
    return {
        FormField: jest.fn().mockImplementation(() => {
            return mockFormField;
        })
    };
});

describe('form-field', () => {
    let element: Wrapper<Vue>;
    let localVue: VueConstructor<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(FormFieldDirective);
        Vue.use(TextfieldPlugin);
    });

    describe(`The form validate its fields`, () => {
        mockFormField = {
            shouldFocus: false,
            isTouched: false,
            hasError: true,
            touched: false
        };

        let formField: FormField<string> = new FormField<string | undefined>(() => undefined, [(value: any) => {
            return new FormFieldValidation(true, [''], ['']);
        }]);

        let form: Form = new Form({
            'a-field': formField
        });

        beforeEach(() => {
            formField = new FormField<string | undefined>(() => undefined, [(value: any) => {
                return new FormFieldValidation(true, [''], ['']);
            }]);

            form = new Form({
                'a-field': formField
            });

            element = mount(
                {
                    template: `<m-textfield v-model.trim="form.get('a-field').value" v-m-form-field="form.get('a-field')">`,
                    data(): any {
                        return {
                            form: form
                        };
                    }
                },
                { localVue: Vue }
            );
        });

        it(`the element should have the focus if first invalid`, () => {
            form.focusFirstFieldWithError();
            expect(mockFormField.shouldFocus).toBe(true);
        });
    });
});
