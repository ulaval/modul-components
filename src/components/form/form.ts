import { Component, Emit, Prop } from "vue-property-decorator";
import { FormGroup } from "../../utils/form/form-control";
import { ModulVue } from "../../utils/vue/vue";

@Component({
    template: `
    <form :id="formGroup.id"
        @submit.prevent="submit"
        @reset.prevent="reset">
      <slot></slot>
    </form>
    `
})
export class MForm extends ModulVue {
    @Prop()
    public formGroup: FormGroup;

    @Emit('submit')
    public emitSubmit(): void { }

    @Emit('reset')
    public emitReset(): void { }

    public submit(): void {
        this.formGroup.validate();

        if (!this.formGroup.isValid) {
            return;
        }

        this.emitSubmit();
    }

    public reset(): void {
        this.formGroup.reset();
        this.emitReset();
    }
}
