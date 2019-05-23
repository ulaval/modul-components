import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { AbstractControl } from '../../utils/form/abstract-control';
import { ControlError } from '../../utils/form/control-error';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormArray } from '../../utils/form/form-array';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ControlValidator } from '../../utils/form/validators/control-validator';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { FormActionFallout } from './form-action-fallout';
import { FormActions } from './form-action-type';
import WithRender from './form.html?style=./form.scss';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public readonly formGroup!: FormGroup;
    public displaySummary: boolean = false;
    public displayToast: boolean = false;

    @Prop({ default: () => ModulVue.prototype.$form.formActionFallouts || [] })
    public actionFallouts: FormActionFallout[];

    @Emit('submit')
    public emitSubmit(): void { }

    @Emit('reset')
    public emitReset(): void { }

    public get formErrors(): ControlError[] {
        return this._getAllFormErrors(this.formGroup);
    }

    public get formControlsInError(): AbstractControl[] {
        return this._getAllControlsInError(this.formGroup);
    }

    public get toastMessage(): string {
        let errorCount: number = this.formControlsInError.length;

        return this.$i18n.translate(
            errorCount <= 1 ? 'm-form:multipleErrorsToCorrect' : 'm-form:multipleErrorsToCorrect.p',
            { totalNbOfErrors: errorCount <= 1 ? 1 : errorCount },
            undefined, undefined, undefined, FormatMode.Sprintf
        );
    }

    public async submit(external: boolean = false): Promise<void> {
        await this.formGroup.submit(external);

        if (!this._isValid(external)) {
            this._triggerActionFallouts(FormActions.InvalidSubmit);
            return;
        }

        this._triggerActionFallouts(FormActions.ValidSubmit);

        if (external) {
            return;
        }

        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();

        this._triggerActionFallouts(FormActions.Reset);
        this.emitReset();
    }

    protected created(): void {
        this._triggerActionFallouts(FormActions.Created);
    }

    protected updated(): void {
        this._triggerActionFallouts(FormActions.Updated);
    }

    protected beforeDestroy(): void {
        this._triggerActionFallouts(FormActions.Destroyed);
        this.formGroup.reset();
    }

    private _isValid(external: boolean = false): boolean {
        if (!external) {
            return this.formGroup.valid;
        }

        return this.formGroup.valid &&
            this._getAllFormValidators(this.formGroup)
                .filter(v => v.validationType === ControlValidatorValidationType.External)
                .every(v => !!v.lastCheck);
    }

    private _triggerActionFallouts(type: FormActions): void {
        this.actionFallouts
            .filter(a => type & a.action)
            .forEach(a => a.fallout(this));
    }

    private _getAllFormErrors(formGroup: FormGroup | FormArray): ControlError[] {
        let result: ControlError[] = formGroup.errors;

        formGroup.controls.forEach(c => {
            if (c instanceof FormControl) {
                result = result.concat(c.errors);
            } else {
                result = result.concat(this._getAllFormErrors(c as FormGroup | FormArray));
            }
        });

        return result;
    }

    private _getAllFormValidators(formGroup: FormGroup | FormArray): ControlValidator[] {
        let result: ControlValidator[] = formGroup.validators;

        formGroup.controls.forEach(c => {
            if (c instanceof FormControl) {
                result = result.concat(c.validators);
            } else {
                result = result.concat(this._getAllFormValidators(c as FormGroup | FormArray));
            }
        });

        return result;
    }

    private _getAllControlsInError(formGroup: FormGroup | FormArray): AbstractControl[] {
        let controls: AbstractControl[] = [];

        if (formGroup.hasError()) {
            controls = controls.concat(formGroup);
        }

        formGroup.controls.forEach(c => {
            if (c.hasError()) {
                controls = controls.concat(c);
            }

            if (!(c instanceof FormControl)) {
                controls = controls.concat(this._getAllControlsInError(c as FormGroup | FormArray));
            }
        });

        return controls;
    }

    @Watch('formErrors')
    public onFormGroupChange(formErrors: ControlError[], oldVal: any): void {
        if (formErrors.length === 0) {
            this.displaySummary = this.displayToast = false;
        }
    }
}
