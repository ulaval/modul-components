import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './input-style.html?style=./input-style.scss';
import { INPUT_STYLE_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';

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

    @Prop({ default: 'auto' })
    public width: boolean;

    @Prop({ default: false })
    public waiting: boolean;

    private animActive: boolean = false;

    protected mounted(): void {
        setTimeout(() => {
            this.animActive = true;
        }, 0);
    }

    private get hasValue(): boolean {
        return this.hasDefaultSlot && !this.empty;
    }

    private get labelIsUp(): boolean {
        return (this.hasValue || (this.isFocus && this.hasValue)) && this.hasLabel;
    }

    private get hasLabel(): boolean {
        return !!this.label && this.label != '';
    }

    private get isFocus(): boolean {
        let focus: boolean = this.focus && !this.as<InputState>().disabled && !this.waiting;
        this.$emit('focus', focus);
        return focus;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasRightContentSlot(): boolean {
        return !!this.$slots['right-content'];
    }

    private hasAdjustWidthAutoSlot(): boolean {
        return !!this.$slots['adjust-width-auto'];
    }

    private onClick(event): void {
        this.$emit('click', event);
    }
}

const InputStylePlugin: PluginObject<any> = {
    install(v, options) {
        v.use(IconPlugin);
        v.use(SpinnerPlugin);
        v.component(INPUT_STYLE_NAME, MInputStyle);
    }
};

export default InputStylePlugin;
