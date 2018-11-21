import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { CHECKBOX_NAME } from '../component-names';
import ValidationMessagePlugin from '../validation-message/validation-message';
import WithRender from './checkbox.html?style=./checkbox.scss';

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
            value === MCheckboxPosition.Left ||
            value === MCheckboxPosition.Right
    })
    public position: MCheckboxPosition;

    private isFocus = false;
    private id: string = `mCheckbox-${uuid.generate()}`;
    private internalValue: boolean = false;

    @Emit('change')
    onChange(value: boolean): void { }

    @Emit('click')
    onClick(event: MouseEvent): void {
        this.$emit('click', event);
        this.$refs['checkbox']['blur']();
    }

    @Watch('value')
    private onValueChange(value: boolean): void {
        this.internalValue = value;
    }

    private get propValue(): boolean {
        return this.value !== undefined ? this.value : this.internalValue;
    }

    private set propValue(value: boolean) {
        this.onChange(value);
        this.internalValue = value;
    }

    private setFocus(value: boolean): void {
        this.isFocus = value;
    }

    private get hasCheckboxLeft(): boolean {
        return this.position === MCheckboxPosition.Left;
    }

    private get hasLabelSlot(): boolean {
        return !!this.$slots.default;
    }

    private get forId(): string | undefined {
        if (this.as<InputStateMixin>().readonly) {
            return undefined;
        } else {
            return this.id;
        }
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHECKBOX_NAME, 'plugin.install');
        v.use(ValidationMessagePlugin);
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
