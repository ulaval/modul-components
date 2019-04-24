import { Component, Emit, Prop } from "vue-property-decorator";
import { FormGroup } from "../../utils/form/form-group";
import { ModulVue } from "../../utils/vue/vue";
import { FormActionFallout } from "./form-action-fallout";
import { FormActionType } from "./form-action-type";
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

    public submit(): void {
        this.formGroup.validate();

        if (!this.formGroup.isValid) {
            this._triggerFormActionFallouts(FormActionType.InvalidSubmit);
            return;
        }

        this._triggerFormActionFallouts(FormActionType.ValidSubmit);
        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();

        this._triggerFormActionFallouts(FormActionType.Reset);
        this.emitReset();
    }

    protected created(): void {
        this._triggerFormActionFallouts(FormActionType.Created);
    }

    protected updated(): void {
        this._triggerFormActionFallouts(FormActionType.Updated);
    }

    protected beforeDestroy(): void {
        this._triggerFormActionFallouts(FormActionType.Destroyed);
    }

    private _triggerFormActionFallouts(type: FormActionType): void {
        this.actionFallouts
            .filter(a => type & a.type)
            .forEach(a => a.fallout(this));
    }
}
