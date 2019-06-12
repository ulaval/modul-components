import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import { MForm } from '../../components/form/form';
import { FormActions } from '../../components/form/form-action-type';
import FormPlugin from '../../components/form/form.plugin';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ControlValidator } from '../../utils/form/validators/control-validator';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-external-validation.sandbox.html';

const ID_FORM_CONTROL_NAME: string = 'name';
const ID_FORM_CONTROL_DESCRIPTION: string = 'description';
const KEY_NAME_VALIDATOR_EXTERNAL: string = 'key_name_validator';
const KEY_DESCRIPTION_VALIDATOR_EXTERNAL: string = 'key_description_validator';
const MAX_NAME_LENGTH: number = 20;

@WithRender
@Component
export class MFormExternalValidationSandbox extends ModulVue {

    readonly refMForm: string = 'ref-m-form';

    formGroup: FormGroup = this.buildFormGroup();

    pendingSubmit: boolean = false;

    get nameField(): FormControl<string> {
        return this.formGroup.getControl(ID_FORM_CONTROL_NAME) as FormControl<string>;
    }

    get descriptionField(): FormControl<string> {
        return this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION) as FormControl<string>;
    }

    get maxNameLength(): number {
        return MAX_NAME_LENGTH;
    }

    reset(): void {
        alert('MFormExternalValidationSandbox.reset');
    }

    submit(): void {
        // strings to differentiate errors created during external call
        const errorOnName: string = 'ErrorOnName';
        const errorOnDescription: string = 'ErrorOnDescription';

        this.pendingSubmit = true;
        try {
            this.pendingSubmit = false;

            // the external call generating the error
            this.throwSpecificErrorsIfNameOrDescriptionAreAbsent(errorOnName, errorOnDescription);

            alert('MFormExternalValidationSandbox.submited!');

            this.$log.info();
        } catch (e) {

            // interpret error and correct error message
            if (e.message.includes(errorOnName)) {
                this.formGroup.setControlInError(ID_FORM_CONTROL_NAME, { message: 'Updated error message using value returned be external call : ' + e.message });
            }
            if (e.message.includes(errorOnDescription)) {
                this.formGroup.setControlInError(ID_FORM_CONTROL_DESCRIPTION, { message: 'Updated error message using value returned be external call : ' + e.message });
            }

            (this.$refs[this.refMForm] as MForm).triggerAction(FormActions.InvalidSubmit);
        }

    }

    private throwSpecificErrorsIfNameOrDescriptionAreAbsent(errorOnName: string, errorOnDescription: string): void {
        let combinedErrors: string = '';
        if (this.formGroup.getControl(ID_FORM_CONTROL_NAME).value === undefined || this.formGroup.getControl(ID_FORM_CONTROL_NAME).value === '') {
            combinedErrors = combinedErrors + errorOnName;
        }
        if (this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION).value === undefined || this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION).value === '') {
            combinedErrors = combinedErrors + errorOnDescription;
        }
        if (combinedErrors.length > 0) {
            throw new Error(combinedErrors);
        }
    }

    clearValue(): void {
        this.formGroup = this.buildFormGroup();
    }

    private buildFormGroup(): FormGroup {
        const formGroup: FormGroup = new FormGroup({
            [ID_FORM_CONTROL_NAME]: new FormControl<string>([
                MaxLengthValidator(ID_FORM_CONTROL_NAME, MAX_NAME_LENGTH, {
                    error: {
                        message: 'Max length : ' + MAX_NAME_LENGTH + ' (custom message)' // setting custom error message on existing validator
                    }
                }),
                {
                    // custom external validator
                    key: KEY_NAME_VALIDATOR_EXTERNAL,
                    validationType: ControlValidatorValidationType.External,
                    validationFunction: (): boolean => true,  // must be true as no error currently
                    error: { message: '' }
                }],
                {
                    initialValue: ''
                }
            ),
            [ID_FORM_CONTROL_DESCRIPTION]: new FormControl<string>([
                {
                    // custom external validator
                    key: KEY_DESCRIPTION_VALIDATOR_EXTERNAL,
                    validationType: ControlValidatorValidationType.External,
                    validationFunction: (): boolean => true,  // must be true as no error currently
                    error: { message: '' }
                } as ControlValidator],
                {
                    initialValue: ''
                }
            )
        });

        return formGroup;
    }

}

const FormExternalValidationSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-external-validation-sandbox`, MFormExternalValidationSandbox);
    }
};

export default FormExternalValidationSandboxPlugin;
