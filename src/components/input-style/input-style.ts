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

    @Prop({ default: true })
    public focus: boolean;

    @Prop({ default: true })
    public empty: boolean;

    private get hasValue(): boolean {
        return !!this.$slots.default && !this.empty;
    }

    private get labelIsUp(): boolean {
        return (this.hasValue || this.isFocus) && this.hasLabel;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get isFocus(): boolean {
        return this.focus && !this.as<InputState>().disabled;
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
