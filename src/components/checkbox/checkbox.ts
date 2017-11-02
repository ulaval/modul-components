import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import ValidationMessagePlugin from '../validation-message/validation-message';

export enum MCheckboxPosition {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component({
    mixins: [InputState]
})
export class MCheckbox extends ModulVue {

    @Prop({ default: MCheckboxPosition.Left })
    public position: MCheckboxPosition;
    @Prop()
    public value: boolean;

    public componentName: string = CHECKBOX_NAME;

    private isFocus = false;
    private id: string = `mCheckbox-${uuid.generate()}`;
    private internalPropValue: boolean = false;

    private get propValue(): boolean {
        return this.value != undefined ? this.value : this.internalPropValue;
    }

    private set propValue(value: boolean) {
        this.$emit('input', value);
        this.internalPropValue = value;
    }

    private onClick(event: MouseEvent): void {
        this.$emit('click', event);
        this.$refs['checkbox']['blur']();
    }

    private setFocus(value: boolean): void {
        this.isFocus = value;
    }

    private get hasCheckboxLeft(): boolean {
        return this.position == MCheckboxPosition.Left;
    }

    private get hasLabelSlot(): boolean {
        return !!this.$slots.default;
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(ValidationMessagePlugin);
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
