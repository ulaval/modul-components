import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { FORM_FIELD_NAME } from '../../directives/directive-names';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FormField } from '../../utils/form/form-field/form-field';
import { ModulVue } from '../../utils/vue/vue';
import TextfieldPlugin from '../textfield/textfield';
import { FormFieldDirective } from './form-field';

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
        localVue = createLocalVue();
        localVue.directive(FORM_FIELD_NAME, FormFieldDirective);
        localVue.use(TextfieldPlugin);
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

            element = mount(
                {
                    template: `<input v-m-form-field="form.get('a-field')" ref="field"></input>`,
                    data(): any {
                        return {
                            form: form
                        };
                    }
                },
                { localVue: localVue }
            );
        });

        it(`the element should have the focus if first invalid`, async () => {
            const spy: any = jest.spyOn(element.find({ ref: 'field' }).element, 'focus');
            form.focusFirstFieldWithError();
            expect(mockFormField.shouldFocus).toBe(true);

            await element.vm.$forceUpdate();

            expect(mockFormField.shouldFocus).toBe(false);
            expect(spy).toHaveBeenCalled();
        });

        it(`it should touch the form field on blur`, () => {
            const spy: any = jest.spyOn(mockFormField, 'touch');

            element.find({ ref: 'field' }).element.focus();
            element.find({ ref: 'field' }).element.blur();

            expect(spy).toBeCalled();
        });
    });
});
