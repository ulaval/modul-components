import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './input-style.html?style=./input-style.scss';
import { INPUT_STYLE_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';

@WithRender
@Component({
    mixins: [InputState]
})
export class MInputStyle extends ModulVue {
    @Prop()
    public label: string;

    @Prop({ default: false })
    public focus: boolean;

    @Prop({ default: true })
    public empty: boolean;

    private get hasValue(): boolean {
        return this.hasDefaultSlot && !this.empty;
    }

    private get labelIsUp(): boolean {
        return (this.hasValue || (this.isFocus && this.hasValue)) && this.hasLabel;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get isFocus(): boolean {
        let focus: boolean = this.focus && !this.as<InputState>().disabled;
        this.$emit('focus', focus);
        return focus;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasRightContentSlot(): boolean {
        return !!this.$slots['right-content'];
    }

    private onClick(event): void {
        this.$emit('click', event);
    }
}

const InputStylePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(INPUT_STYLE_NAME, MInputStyle);
    }
};

export default InputStylePlugin;
