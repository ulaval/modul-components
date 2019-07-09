import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import { MForm } from '../../components/form/form';
import { FormActions } from '../../components/form/form-action-type';
import FormPlugin from '../../components/form/form.plugin';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-external-validation.sandbox.html';

const ID_FORM_CONTROL_NAME: string = 'name';
const ID_FORM_CONTROL_DESCRIPTION: string = 'description';
const MAX_NAME_LENGTH: number = 20;

@WithRender
@Component
export class MFormExternalValidationSandbox extends ModulVue {

    readonly refMForm: string = 'ref-m-form';

    formGroup: FormGroup = this.buildFormGroup();

    pendingSubmit: boolean = false;

    get nameField(): AbstractControl<string> {
        return this.formGroup.getControl<string>(ID_FORM_CONTROL_NAME);
    }

    get descriptionField(): AbstractControl<string> {
        return this.formGroup.getControl<string>(ID_FORM_CONTROL_DESCRIPTION);
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
                this.formGroup.getControl(ID_FORM_CONTROL_NAME).errors = [{ message: 'Updated error message using value returned be external call : ' + e.message }];
            }
            if (e.message.includes(errorOnDescription)) {
                this.formGroup.getControl(ID_FORM_CONTROL_DESCRIPTION).errors = [{ message: 'Updated error message using value returned be external call : ' + e.message }];
            }

            (this.$refs[this.refMForm] as MForm).triggerActionFallouts(FormActions.InvalidSubmit);
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
                MaxLengthValidator(MAX_NAME_LENGTH,
                    {
                        error: {
                            message: 'Max length : ' + MAX_NAME_LENGTH + ' (custom message)' // setting custom error message on existing validator
                        }
                    })],
                {
                    initialValue: ''
                }
            ),
            [ID_FORM_CONTROL_DESCRIPTION]: new FormControl<string>([])
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
