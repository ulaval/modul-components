import { Component, Emit, Prop } from "vue-property-decorator";
import { AbstractControlError } from "../../utils/form/abstract-control-error";
import { FormGroup } from "../../utils/form/form-group";
import { ModulVue } from "../../utils/vue/vue";
import { FormActionFallout } from "./form-action-fallout";
import { FormActions } from "./form-action-type";
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

    public get summaryErrors(): AbstractControlError[] {
        return this.formGroup.errors.concat(
            this.formGroup.controls
                .map(c => c.errors)
                .reduce((acc, curr) => acc.concat(curr), [])
        );
    }

    public submit(): void {
        this.formGroup.validate();

        if (!this.formGroup.isValid) {
            this._triggerActionFallouts(FormActions.InvalidSubmit);
            return;
        }

        this._triggerActionFallouts(FormActions.ValidSubmit);
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
    }

    private _triggerActionFallouts(type: FormActions): void {
        this.actionFallouts
            .filter(a => type & a.action)
            .forEach(a => a.fallout(this));
    }
}
