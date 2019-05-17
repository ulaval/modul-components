import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { MAutoCompleteResult } from '../../components/autocomplete/autocomplete';
import { FORM_NAME } from '../../components/component-names';
import FormPlugin from '../../components/form/form.plugin';
import { MDateRange } from '../../components/periodpicker/periodpicker';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-all.sandbox.html';

@WithRender
@Component
export class MFormAllSandbox extends ModulVue {
    types: string[] = ['douce', 'blanche', 'sec'];
    coupes: string[] = ['régulière', 'julienne', 'ondulé'];

    autocompleteResults: MAutoCompleteResult[] = [{ label: 'RandomDog', value: 'RandomDog' }, { label: 'RandomDog2', value: 'RandomDog2' }];

    loadedValues: any = {
        name: 'Patate',
        description: 'La patate est\nun légume vraiment...',
        birthday: '1970-01-01',
        type: 'sec',
        active: true,
        coupe: 'julienne',
        time: '12:05',
        decimal: 123456.78,
        integer: 12345,
        price: 99.99,
        switch: true,
        daterange: { from: '2019-02-20T05:00:00.000Z', to: '2019-03-01T04:59:59.999Z' },
        autocomplete: 'RandomDog2'
    };

    formAllGroup: FormGroup = new FormGroup({
        name: new FormControl<string>(
            [
                RequiredValidator('name'),
                MaxLengthValidator('name', 20)
            ]
        ),
        description: new FormControl<string>(
            [
                RequiredValidator('description'),
                MaxLengthValidator('description', 255)
            ]
        ),
        birthdate: new FormControl<string>(
            [
                RequiredValidator('birthdate')
            ]
        ),
        type: new FormControl<string>(
            [
                RequiredValidator('type')
            ]
        ),
        active: new FormControl<boolean>(
            [
                RequiredValidator('active')
            ]
        ),
        coupe: new FormControl<string>(
            [
                RequiredValidator('coupe')
            ]
        ),
        time: new FormControl<string>(
            [
                RequiredValidator('time')
            ]
        ),
        decimal: new FormControl<number>(
            [
                RequiredValidator('decimal')
            ]
        ),
        integer: new FormControl<number>(
            [
                RequiredValidator('integer')
            ]
        ),
        price: new FormControl<number>(
            [
                RequiredValidator('price')
            ]
        ),
        switch: new FormControl<boolean>(
            [
                RequiredValidator('switch')
            ]
        ),
        daterange: new FormControl<MDateRange>(
            [
                RequiredValidator('daterange')
            ]
        ),
        autocomplete: new FormControl<MDateRange>(
            [
                RequiredValidator('autocomplete')
            ]
        )
    });

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

    get typeField(): FormControl<string> {
        return this.formAllGroup.getControl('type') as FormControl<string>;
    }

    get activeField(): FormControl<boolean> {
        return this.formAllGroup.getControl('active') as FormControl<boolean>;
    }

    get coupeField(): FormControl<string> {
        return this.formAllGroup.getControl('coupe') as FormControl<string>;
    }

    get timeField(): FormControl<string> {
        return this.formAllGroup.getControl('time') as FormControl<string>;
    }

    get decimalField(): FormControl<number> {
        return this.formAllGroup.getControl('decimal') as FormControl<number>;
    }

    get integerField(): FormControl<number> {
        return this.formAllGroup.getControl('integer') as FormControl<number>;
    }

    get priceField(): FormControl<number> {
        return this.formAllGroup.getControl('price') as FormControl<number>;
    }

    get switchField(): FormControl<boolean> {
        return this.formAllGroup.getControl('switch') as FormControl<boolean>;
    }

    get daterangeField(): FormControl<MDateRange> {
        return this.formAllGroup.getControl('daterange') as FormControl<MDateRange>;
    }

    get autocompleteField(): FormControl<string> {
        return this.formAllGroup.getControl('autocomplete') as FormControl<string>;
    }

    loadValue(): void {
        this.nameField.value = this.loadedValues.name;
        this.descriptionField.value = this.loadedValues.description;
        this.birthdateField.value = this.loadedValues.birthday;
        this.typeField.value = this.loadedValues.type;
        this.activeField.value = this.loadedValues.active;
        this.coupeField.value = this.loadedValues.coupe;
        this.timeField.value = this.loadedValues.time;
        this.decimalField.value = this.loadedValues.decimal;
        this.integerField.value = this.loadedValues.integer;
        this.priceField.value = this.loadedValues.price;
        this.switchField.value = this.loadedValues.switch;
        this.daterangeField.value = this.loadedValues.daterange;
        this.autocompleteField.value = this.loadedValues.autocomplete;
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

    private onComplete(value: string): void {
        this.autocompleteResults = [...this.autocompleteResults];
    }
}

const FormAllSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-all-sandbox`, MFormAllSandbox);
    }
};

export default FormAllSandboxPlugin;
