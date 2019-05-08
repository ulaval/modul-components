import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import { FORM_NAME } from '../component-names';
import WithRender from './form-all.sandbox.html';
import FormPlugin from './form.plugin';

@WithRender
@Component
export class MFormAllSandbox extends ModulVue {

    types: string[] = ['douce', 'blanche', 'sec'];

    loadedValues: any = {
        name: 'Patate',
        description: 'La patate est\nun légume vraiment...',
        birthday: '1970-01-01',
        type: 'sec'
    };

    formAllGroup: FormGroup = new FormGroup('Form with all field example',
        [
            new FormControl<string>(
                'name',
                [
                    RequiredValidator('name'),
                    MaxLengthValidator('name', 20)
                ]
            ),
            new FormControl<string>(
                'description',
                [
                    RequiredValidator('description'),
                    MaxLengthValidator('description', 255)
                ]
            ),
            new FormControl<string>(
                'birthdate',
                [
                    RequiredValidator('birthdate')
                ]
            )
        ]);

    submit(): void {
        this.$log.info('MFormAllSandbox.submit');
    }

    reset(): void {
        this.$log.info('MFormAllSandbox.reset');
    }

    get nameField(): FormControl<string> {
        return this.formAllGroup.getControl('name') as FormControl<string>;
    }

    get descriptionField(): FormControl<string> {
        return this.formAllGroup.getControl('description') as FormControl<string>;
    }

    get birthdateField(): FormControl<string> {
        return this.formAllGroup.getControl('birthdate') as FormControl<string>;
    }

    loadValue(): void {
        this.nameField.value = this.loadedValues.name;
        this.descriptionField.value = this.loadedValues.description;
        this.birthdateField.value = this.loadedValues.birthday;
    }

    toggleReadonly(): void {
        this.formAllGroup.readonly = !this.formAllGroup.readonly;

    }

    toggleDisabled(): void {
        this.formAllGroup.enabled = !this.formAllGroup.enabled;
    }

    toggleWaiting(): void {
        this.formAllGroup.waiting = !this.formAllGroup.waiting;
    }




}


const FormAllSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-all-sandbox`, MFormAllSandbox);
    }
};

export default FormAllSandboxPlugin;
