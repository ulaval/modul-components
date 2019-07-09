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
    public onFormGroupErrorsChange(controlErrors: ControlError[]): void {
        if (controlErrors.length === 0) {
            this._hideSummaryAndToast();
        }
    }

    public get formErrors(): ControlError[] {
        return this.formGroup.errorsDeep;
    }

    public get summaryMessages(): string[] {
        return this.formErrors.map(error => getString(error.groupMessage) || getString(error.message));
    }

    public get toastMessage(): string {
        let errorCount: number = this.formErrors.length;

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

    private _getAllFormValidators(control: FormGroup | FormArray): ControlValidator[] {
        let result: ControlValidator[] = control.validators;

        control.controls.forEach(c => {
            if (c instanceof FormControl) {
                result = result.concat(c.validators);
            } else if (c instanceof FormGroup || c instanceof FormArray) {
                result = result.concat(this._getAllFormValidators(c));
            }
        });

        return result;
    }

    private _getAllControlsInError(control: FormGroup | FormArray): AbstractControl[] {
        let controls: AbstractControl[] = [];

        if (control.hasError()) {
            controls.push(control);
        }

        control.controls.forEach(c => {
            if (c.hasError()) {
                controls.push(c);
            }

            if (c instanceof FormGroup || c instanceof FormArray) {
                controls = controls.concat(this._getAllControlsInError(c));
            }
        });

        return controls;
    }

    private _hideSummaryAndToast(): void {
        this.displaySummary = this.displayToast = false;
    }
}
