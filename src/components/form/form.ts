import { Component, Emit, Prop } from 'vue-property-decorator';
import { ControlError } from '../../utils/form/control-error';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormGroup } from '../../utils/form/form-group';
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

    @Prop({ default: -200 })
    public scrollToOffset: number;

    @Emit('submit')
    public emitSubmit(): void { }

    @Emit('reset')
    public emitReset(): void { }

    public get summaryErrors(): ControlError[] {
        return this.formGroup.errors.concat(
            this.formGroup.controls
                .map(c => c.errors)
                .reduce((acc, curr) => acc.concat(curr), [])
        );
    }

    public hasErrors(): boolean {
        return this.summaryErrors.length > 0;
    }

    public get toastMessage(): string {
        const formControlErrorsCount: number = this.formGroup.controls.filter(c => c.errors.length > 0).length;
        const formGroupErrorsCount: number = this.formGroup.errors.length;
        return (ModulVue.prototype).$i18n
            .translate(
                'm-form:multipleErrorsToCorrect',
                { totalNbOfErrors: formControlErrorsCount + formGroupErrorsCount },
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
            this.formGroup.controls
                .map(c => c.validators)
                .reduce((acc, cur) => acc.concat(cur), [])
                .filter(v => v.validationType === ControlValidatorValidationType.External)
                .every(v => !!v.lastCheck);
    }

    private _triggerActionFallouts(type: FormActions): void {
        this.actionFallouts
            .filter(a => type & a.action)
            .forEach(a => a.fallout(this));
    }

}
