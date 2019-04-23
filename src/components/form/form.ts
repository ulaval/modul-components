import { Component, Emit, Prop } from "vue-property-decorator";
import { FormGroup } from "../../utils/form/form-group";
import { ModulVue } from "../../utils/vue/vue";
import { FormActionType } from "./form-action-type";
import { FormAfterActionEffect } from "./form-after-action-effect";
import { FormAfterActionEffects } from "./form-after-action-effects";
import WithRender from './form.html?style=./form.scss';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public formGroup: FormGroup;
    public displaySummary: boolean = false;

    @Prop({
        default: () => [
            FormAfterActionEffects.ErrorToast,
            FormAfterActionEffects.ClearErrorToast,
            FormAfterActionEffects.FocusOnFirstError
        ]
    })
    public afterActionEffects: FormAfterActionEffect[];

    @Emit('submit')
    public emitSubmit(): void { }

    @Emit('reset')
    public emitReset(): void { }

    public submit(): void {
        this.formGroup.validate();

        if (!this.formGroup.isValid) {
            this._triggerFormAction(FormActionType.InvalidSubmit);
            return;
        }

        this._triggerFormAction(FormActionType.ValidSubmit);
        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();

        this._triggerFormAction(FormActionType.Reset);
        this.emitReset();
    }

    protected beforeDestroy(): void {
        this._triggerFormAction(FormActionType.Destroy);
    }

    private _triggerFormAction(type: FormActionType): void {
        this.afterActionEffects
            .filter(a => type & a.formActionType)
            .forEach(a => {
                a.afterEffect(this);
            });
    }
}
