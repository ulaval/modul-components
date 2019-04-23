import { Component, Emit, Prop } from "vue-property-decorator";
import { FormGroup } from "../../utils/form/form-control";
import { FormActionType, FormAfterActionEffect, FormBehavior } from "../../utils/form/form-service/form-service";
import { ModulVue } from "../../utils/vue/vue";
import WithRender from './form.html?style=./form.scss';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public formGroup: FormGroup;

    @Prop({
        default: () => [
            FormBehavior.ErrorToast,
            FormBehavior.ClearToast,
            FormBehavior.ErrorFocus,
            FormBehavior.ErrorMessages
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
            this.afterActionEffects
                .filter(a => a.formActionType === FormActionType.InvalidSubmit)
                .forEach(a => {
                    a.afterEffect(this.formGroup);
                });
            return;
        }

        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();

        this.afterActionEffects
            .filter(a => a.formActionType === FormActionType.Reset)
            .forEach(a => a.afterEffect(this.formGroup));
        this.emitReset();
    }
}
