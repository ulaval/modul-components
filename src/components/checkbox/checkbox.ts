import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
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

    @Model('change')
    @Prop()
    public value: boolean;

    @Prop({
        default: MCheckboxPosition.Left,
        validator: value =>
            value == MCheckboxPosition.Left ||
            value == MCheckboxPosition.Right
    })
    public position: MCheckboxPosition;

    private isFocus = false;
    private id: string = `mCheckbox-${uuid.generate()}`;
    private internalValue: boolean = false;

    @Watch('value')
    private onValueChange(value: boolean): void {
        this.internalValue = value;
    }

    private get propValue(): boolean {
        return this.value != undefined ? this.value : this.internalValue;
    }

    private set propValue(value: boolean) {
        this.$emit('change', value);
        this.internalValue = value;
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
    install(v, options): void {
        console.debug(CHECKBOX_NAME, 'plugin.install');
        v.use(ValidationMessagePlugin);
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
