import { Component, Emit, Prop } from 'vue-property-decorator';
import { ControlError } from '../../utils/form/control-error';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormGroup } from '../../utils/form/form-group';
import { ModulVue } from '../../utils/vue/vue';
import { FormActionFallout } from './form-action-fallout';
import { FormActions } from './form-action-type';
import WithRender from './form.html?style=./form.scss';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public formGroup: FormGroup;
    public displaySummary: boolean = false;

    @Prop({ default: () => ModulVue.prototype.$form.formActionFallouts || [] })
    public actionFallouts: FormActionFallout[];

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

    public async submit(external: boolean = false): Promise<void> {
        await this.formGroup.validate(external);

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
