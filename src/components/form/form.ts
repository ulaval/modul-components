import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { AbstractControl } from '../../utils/form/abstract-control';
import { ControlError } from '../../utils/form/control-error';
import { FormArray } from '../../utils/form/form-array';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ControlValidator } from '../../utils/form/validators/control-validator';
import { FormatMode } from '../../utils/i18n/i18n';
import { getString } from '../../utils/str/str';
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

    @Watch('formErrors')
    public onFormGroupErrorsChange(formErrors: ControlError[]): void {
        if (formErrors.length === 0) {
            this._hideToast();
        }
    }

    public get formErrors(): ControlError[] {
        return this._getAllFormErrors(this.formGroup);
    }

    public get errorMessages(): string[] {
        return this.formErrors.map(error => getString(error.groupMessage) || getString(error.message));
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

    public triggerActionFallouts(action: FormActions): void {
        this.actionFallouts
            .filter(a => action & a.action)
            .forEach(a => a.fallout(this));
    }

    public async submit(): Promise<void> {
        await this.formGroup.submit();

        if (!this.formGroup.valid) {
            this.triggerActionFallouts(FormActions.InvalidSubmit);
            return;
        }

        this.triggerActionFallouts(FormActions.ValidSubmit);

        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();

        this.triggerActionFallouts(FormActions.Reset);
        this.emitReset();
    }

    protected created(): void {
        this.triggerActionFallouts(FormActions.Created);
    }

    protected updated(): void {
        this.triggerActionFallouts(FormActions.Updated);
    }

    protected beforeDestroy(): void {
        this.triggerActionFallouts(FormActions.Destroyed);
        this.formGroup.reset();
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

    private _hideToast(): void {
        this.displaySummary = this.displayToast = false;
    }
}
