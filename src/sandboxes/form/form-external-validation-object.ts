import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import { MForm } from '../../components/form/form';
import FormPlugin from '../../components/form/form.plugin';
import { ControlErrorImpl } from '../../utils/form/control-error-impl';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { AlwayTrueExternalValidator, ControlValidatorImpl, ControlValidatorOptionsImpl } from '../../utils/form/validators/control-validator-impl';
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
export class MFormExternalValidationObjectSandbox extends ModulVue {

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
            // reset validation function
            this.formGroup.getControl(ID_FORM_CONTROL_NAME).validators.find(v => v.key === KEY_NAME_VALIDATOR_EXTERNAL)!.validationFunction = (): boolean => true;
            this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION).validators.find(v => v.key === KEY_DESCRIPTION_VALIDATOR_EXTERNAL)!.validationFunction = (): boolean => true;

            // interpret error, assign failing validation function and correct error message
            if (e.message.includes(errorOnName)) {
                let validator: ControlValidatorImpl = this.formGroup.getControl(ID_FORM_CONTROL_NAME).validators.find(v => v.key === KEY_NAME_VALIDATOR_EXTERNAL)! as ControlValidatorImpl;
                validator.validationFunction = (): boolean => false;
                validator.setError('Updated NAME error message using value returned be external call : ' + e.message);
            }
            if (e.message.includes(errorOnDescription)) {
                let validator: ControlValidatorImpl = this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION).validators.find(v => v.key === KEY_DESCRIPTION_VALIDATOR_EXTERNAL)! as ControlValidatorImpl;
                validator.setValidationFunction((): boolean => false);
                validator.setError('Updated DESCRIPTION error message using value returned be external call : ' + e.message);
            }

            // resubmit the form and validate external validations
            (this.$refs[this.refMForm] as MForm).submit(true);
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
                MaxLengthValidator(
                    ID_FORM_CONTROL_NAME, MAX_NAME_LENGTH,
                    new ControlValidatorOptionsImpl(
                        new ControlErrorImpl('Max length : ' + MAX_NAME_LENGTH + ' (custom message)') // setting custom error message on existing validator
                    )
                ),
                new AlwayTrueExternalValidator(KEY_DESCRIPTION_VALIDATOR_EXTERNAL)],
                {
                    initialValue: ''
                }
            ),
            [ID_FORM_CONTROL_DESCRIPTION]: new FormControl<string>([
                new AlwayTrueExternalValidator(KEY_DESCRIPTION_VALIDATOR_EXTERNAL)],
                {
                    initialValue: ''
                }
            )
        });

        return formGroup;
    }

}

const FormExternalValidationObjectSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-external-validation-object-sandbox`, MFormExternalValidationObjectSandbox);
    }
};

export default FormExternalValidationObjectSandboxPlugin;
