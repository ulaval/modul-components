import { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { FORM_NAME } from '../../components/component-names';
import FormPlugin from '../../components/form/form.plugin';
import { AbstractControl } from '../../utils/form/abstract-control';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormArray } from '../../utils/form/form-array';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ControlValidator, ControlValidatorOptions } from '../../utils/form/validators/control-validator';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { MinLengthValidator } from '../../utils/form/validators/min-length/min-length';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './form-complex.sandbox.html';

const ID_FORM_APPLES: string = 'apples';
const ID_FORM_BANANAS: string = 'bananas';
const ID_FORM_FRUITS: string = 'fruits';

class Validations {
    static validatePickingLessThen24Bananas: (options?: ControlValidatorOptions) => ControlValidator = (options?: ControlValidatorOptions): ControlValidator => {
        return {
            validationFunction: (self: AbstractControl): boolean => {
                let valeur: number = 0;
                self.controls.forEach((control) => {
                    valeur = valeur + control.getControl(ID_FORM_FRUITS).getControl(ID_FORM_BANANAS).value;
                });
                return valeur <= 24;
            },
            error: {
                message: 'There are only 24 bananas available in the store'
            },
            validationType: ControlValidatorValidationType.OnGoing
        };
    }

    static validatePickingLessThen24FruitsInCart: (options?: ControlValidatorOptions) => ControlValidator = (options?: ControlValidatorOptions): ControlValidator => {
        return {
            validationFunction: (self: AbstractControl): boolean => {
                let valeur: number = 0;
                self.controls.forEach((obj) => {
                    valeur = valeur + obj.value;
                });
                return valeur <= 24;
            },
            error: {
                message: 'You can only put 24 fruits in this cart.'
            },
            validationType: ControlValidatorValidationType.OnGoing
        };
    }
}

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
            { name: 'Joe', [ID_FORM_APPLES]: 4, [ID_FORM_BANANAS]: 10 },
            { name: 'John', [ID_FORM_APPLES]: 3, [ID_FORM_BANANAS]: 11 }
        ]
    };

    formGroup: FormGroup = this.buildFormGroup();

    get nameField(): AbstractControl<string> {
        return this.formGroup.getControl<string>('name');
    }

    get descriptionField(): AbstractControl<string> {
        return this.formGroup.getControl<string>('description');
    }

    get birthdateField(): AbstractControl<string> {
        return this.formGroup.getControl<string>('birthdate');
    }

    get typeField(): AbstractControl<string> {
        return this.formGroup.getControl<string>('type');
    }

    get champSupplActive(): AbstractControl<boolean> {
        return this.formGroup.getControl<boolean>('champSupplActive');
    }

    get supplActiveValue(): boolean {
        return this.champSupplActive.value;
    }

    set supplActiveValue(value: boolean) {
        this.champSupplActive.value = value;
    }

    get champSupplGroup(): AbstractControl {
        return this.formGroup.getControl('champSuppl');
    }

    get supplField1(): AbstractControl<number> {
        return this.champSupplGroup.getControl<number>('supplField1');
    }

    get supplField2(): AbstractControl<number> {
        return this.champSupplGroup.getControl<number>('supplField2');
    }

    get supplField3(): AbstractControl<number> {
        return this.champSupplGroup.getControl<number>('supplField3');
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
        this.itemsArray.validate();
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
                    RequiredValidator(),
                    MaxLengthValidator(20),
                    MinLengthValidator(2)
                ],
                {
                    initialValue: data.name ? data.name : ''
                }
            ),
            description: new FormControl<string>(
                [
                    RequiredValidator(),
                    MaxLengthValidator(255)
                ],
                {
                    initialValue: data.description ? data.description : ''
                }
            ),
            birthdate: new FormControl<string>(
                [
                    RequiredValidator()
                ],
                {
                    initialValue: data.birthday ? data.birthday : ''
                }
            ),
            type: new FormControl<string>(
                [
                    RequiredValidator()
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
            items: new FormArray([],
                [Validations.validatePickingLessThen24Bananas()])
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
                RequiredValidator()],
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
                    RequiredValidator(),
                    MaxLengthValidator(20),
                    MinLengthValidator(2)
                ],
                {
                    initialValue: data.name ? data.name : ''
                }
            ),
            fruits: new FormGroup({
                [ID_FORM_APPLES]: new FormControl<number>(
                    [
                        RequiredValidator()
                    ],
                    {
                        initialValue: data[ID_FORM_APPLES] ? data[ID_FORM_APPLES] : ''
                    }
                ),
                [ID_FORM_BANANAS]: new FormControl<number>(
                    [
                        RequiredValidator()
                    ],
                    {
                        initialValue: data[ID_FORM_BANANAS] ? data[ID_FORM_BANANAS] : ''
                    }
                )
            }, [Validations.validatePickingLessThen24FruitsInCart()])
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
