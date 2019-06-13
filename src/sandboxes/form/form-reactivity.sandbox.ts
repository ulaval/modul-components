import { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import FormPlugin from '../../components/form/form.plugin';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ControlValidator } from '../../utils/form/validators/control-validator';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-reactivity.sandbox.html';

const ID_FORM_CONTROL_NAME: string = 'name';
const ID_FORM_CONTROL_DESCRIPTION: string = 'description';
const KEY_DESCRIPTION_RESTRICTED: string = 'key_description_restricted';

@WithRender
@Component
export class MFormReactivitySandbox extends ModulVue {
    readonly refMForm: string = 'ref-m-form';

    formGroup: FormGroup = this.buildFormGroup();
    formGroup2: FormGroup = this.buildFormGroup2();
    name: string = 'John';

    pendingSubmit: boolean = false;

    get nameField(): FormControl<string> {
        return this.formGroup.getControl(ID_FORM_CONTROL_NAME) as FormControl<string>;
    }

    get descriptionField(): FormControl<string> {
        return this.formGroup2.getControl(ID_FORM_CONTROL_DESCRIPTION) as FormControl<string>;
    }

    reset(): void {
        alert('FormReactivitySandboxPlugin.reset');
    }

    submit(): void {
        this.name = this.nameField.value!;
        alert('Submit');
    }

    // TODO: Remove this watch
    @Watch('name', { immediate: true })
    mettreAJourChamp(): void {
        this.nameField.reset(this.name); // this.name will be the value you get after pressing reset from now on.
    }

    public erreurMessageDescriptionField(): string {
        return `Erreur: ` + this.name + ` does not like that`;
    }

    private buildFormGroup(): FormGroup {
        const formGroup: FormGroup = new FormGroup({
            [ID_FORM_CONTROL_NAME]: new FormControl<string>(
                [RequiredValidator()]
            )
        });

        return formGroup;
    }
    private buildFormGroup2(): FormGroup {
        const formGroup: FormGroup = new FormGroup({
            [ID_FORM_CONTROL_DESCRIPTION]: new FormControl<string>(
                [
                    {
                        key: KEY_DESCRIPTION_RESTRICTED,
                        validationFunction: (control: FormControl<string>): boolean => {
                            return 'poulet' === control.value!;
                        },
                        error: { message: this.erreurMessageDescriptionField },
                        validationType: ControlValidatorValidationType.Correction
                    } as ControlValidator]
            )
        });

        return formGroup;
    }

}

const FormReactivitySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-reactivity-sandbox`, MFormReactivitySandbox);
    }
};

export default FormReactivitySandboxPlugin;
