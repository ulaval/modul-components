import { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import FormPlugin from '../../components/form/form.plugin';
import { FormArray } from '../../utils/form/form-array';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { MinLengthValidator } from '../../utils/form/validators/min-length/min-length';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-complex.sandbox.html';

@WithRender
@Component
export class MFormAllSandbox extends ModulVue {
    types: string[] = ['douce', 'blanche', 'sec'];

    pendingSubmit: boolean = false;

    loadedValues: any = {
        name: 'Patate',
        description: 'La patate est\nun légume vraiment...',
        birthday: '1970-01-01',
        type: 'sec',
        champSupplActive: true,
        champSuppl: {
            supplField1: 'suppl field 1',
            supplField3: 'suppl field 3'
        },
        items: [
            { name: 'Joe', optionalData: 'blow' },
            { name: 'John' }
        ]
    };

    formGroup: FormGroup = this.buildFormGroup();

    get nameField(): FormControl<string> {
        return this.formGroup.getControl('name') as FormControl<string>;
    }

    get descriptionField(): FormControl<string> {
        return this.formGroup.getControl('description') as FormControl<string>;
    }

    get birthdateField(): FormControl<string> {
        return this.formGroup.getControl('birthdate') as FormControl<string>;
    }

    get typeField(): FormControl<string> {
        return this.formGroup.getControl('type') as FormControl<string>;
    }

    get champSupplActive(): FormControl<boolean> {
        return this.formGroup.getControl('champSupplActive') as FormControl<boolean>;
    }

    get supplActiveValue(): boolean | undefined {
        return this.champSupplActive.value;
    }

    get champSupplGroup(): FormGroup {
        return this.formGroup.getControl('champSuppl') as FormGroup;
    }

    get supplField1(): FormControl<string> {
        return this.champSupplGroup.getControl('supplField1') as FormControl<string>;
    }

    get supplField2(): FormControl<string> {
        return this.champSupplGroup.getControl('supplField2') as FormControl<string>;
    }

    get supplField3(): FormControl<string> {
        return this.champSupplGroup.getControl('supplField3') as FormControl<string>;
    }

    get itemsArray(): FormArray {
        return this.formGroup.getControl('items') as FormArray;
    }

    submit(): void {
        this.pendingSubmit = true;
        setTimeout(() => {
            this.pendingSubmit = false;
            alert('MFormAllSandbox.submit!');
            this.$log.info();
        }, 2000);
    }

    reset(): void {
        alert('MFormAllSandbox.reset');
    }

    loadValue(): void {
        this.formGroup = this.buildFormGroup(this.loadedValues);
    }

    clearValue(): void {
        this.formGroup = this.buildFormGroup({});
    }

    toggleReadonly(): void {
        this.formGroup.readonly = !this.formGroup.readonly;

    }

    toggleDisabled(): void {
        this.formGroup.enabled = !this.formGroup.enabled;
    }

    toggleWaiting(): void {
        this.formGroup.waiting = !this.formGroup.waiting;
    }

    addItem(): void {
        this.itemsArray.addControl(this.buildItemsFormGroup());
    }

    deleteItem(index): void {
        this.itemsArray.removeControl(index);
    }

    @Watch('supplActiveValue', { immediate: true })
    public onChampSuppl(newVal: any): void {

        if (newVal) {
            this.champSupplGroup.enabled = true;
        } else {
            this.champSupplGroup.enabled = false;
        }

    }

    private buildFormGroup(data: any = {}): FormGroup {
        const _formGroup: FormGroup = new FormGroup({
            name: new FormControl<string>(
                [
                    RequiredValidator('name'),
                    MaxLengthValidator('name', 20),
                    MinLengthValidator('name', 2)
                ],
                {
                    initialValue: data.name ? data.name : ''
                }
            ),
            description: new FormControl<string>(
                [
                    RequiredValidator('description'),
                    MaxLengthValidator('description', 255)
                ],
                {
                    initialValue: data.description ? data.description : ''
                }
            ),
            birthdate: new FormControl<string>(
                [
                    RequiredValidator('birthdate')
                ],
                {
                    initialValue: data.birthday ? data.birthday : ''
                }
            ),
            type: new FormControl<string>(
                [
                    RequiredValidator('type')
                ],
                {
                    initialValue: data.type ? data.type : ''
                }
            ),
            champSupplActive: new FormControl<boolean>([],
                {
                    initialValue: data.champSupplActive ? data.champSupplActive : false
                }),
            champSuppl: this.buildChampSupplFormGroup(data.champSuppl ? data.champSuppl : {}),
            items: new FormArray()
        });

        if (data.items && data.items.length > 0) {
            data.items.forEach(data => {
                (_formGroup.getControl('items') as FormArray).addControl(this.buildItemsFormGroup(data));
            });
        }

        return _formGroup;
    }


    private buildChampSupplFormGroup(data: any = {}): FormGroup {
        return new FormGroup({
            supplField1: new FormControl<string>([
                RequiredValidator('supplField1')],
                {
                    initialValue: data.supplField1 ? data.supplField1 : ''
                }),
            supplField2: new FormControl<string>([],
                {
                    initialValue: data.supplField2 ? data.supplField2 : ''
                }),
            supplField3: new FormControl<string>([],
                {
                    initialValue: data.supplField3 ? data.supplField3 : ''
                })
        });
    }

    private buildItemsFormGroup(data: any = {}): FormGroup {
        return new FormGroup({
            name: new FormControl<string>(
                [
                    RequiredValidator('name'),
                    MaxLengthValidator('name', 20),
                    MinLengthValidator('name', 2)
                ],
                {
                    initialValue: data.name ? data.name : ''
                }
            ),
            optionalData: new FormControl<string>(
                [
                    MaxLengthValidator('optionalData', 255)
                ],
                {
                    initialValue: data.optionalData ? data.optionalData : ''
                }
            )
        });
    }
}

const FormAllSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-complex-sandbox`, MFormAllSandbox);
    }
};

export default FormAllSandboxPlugin;
