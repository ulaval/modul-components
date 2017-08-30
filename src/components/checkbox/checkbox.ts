import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MCheckbox extends Vue {

    @Prop({ default: POSITION_LEFT })
    public position: string;
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
        return this.position == POSITION_LEFT;
    }

    private get hasLabelSlot(): boolean {
        return !!this.$slots.default;
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
