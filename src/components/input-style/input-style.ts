import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_STYLE_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';
import WithRender from './input-style.html?style=./input-style.scss';

@WithRender
@Component({
    mixins: [InputState]
})
export class MInputStyle extends ModulVue {
    @Prop()
    public label: string;
    @Prop()
    public labelFor: string;
    @Prop()
    public focus: boolean;
    @Prop({ default: true })
    public empty: boolean;
    @Prop()
    public width: string;
    @Prop()
    public iconName: string;
    @Prop()
    public requiredMarker: boolean;

    private animActive: boolean = false;

    public setInputWidth(): void {
        this.$nextTick(() => {
            let labelEl: HTMLElement = this.$refs.label as HTMLElement;
            let inputEl: HTMLElement = this.$el.querySelector('input') as HTMLElement;
            let adjustWidthAutoEl: HTMLElement = this.$refs.adjustWidthAuto as HTMLElement;
            if (inputEl) {
                if (this.width === 'auto' && this.hasAdjustWidthAutoSlot) {
                    setTimeout(() => {
                        inputEl.style.width = '0px';
                        setTimeout(() => {
                            let width: number = adjustWidthAutoEl.clientWidth < 50 ? 50 : adjustWidthAutoEl.clientWidth;
                            if (this.hasLabel) {
                                width = !this.labelIsUp && (labelEl.clientWidth > width) ? labelEl.clientWidth : width;
                            }
                            inputEl.style.width = width + 'px';
                        }, 0);
                    }, 0);

                } else {
                    if (inputEl.style.width) {
                        inputEl.style.removeProperty('width');
                    }
                }
            }
        });
    }
    protected created(): void {
        setTimeout(() => {
            this.animActive = true;
            this.setInputWidth();
        }, 0);
    }

    private get hasValue(): boolean {
        return this.hasDefaultSlot && !this.empty;
    }

    private get labelIsUp(): boolean {
        return (this.hasValue || (this.isFocus && this.hasValue)) && this.hasLabel && this.as<InputState>().active;
    }

    private get hasLabel(): boolean {
        return this.hasIcon || this.hasLabelText;
    }

    private get hasLabelText(): boolean {
        return !!this.label && this.label !== '';
    }

    private get isFocus(): boolean {
        let focus: boolean = this.focus && this.as<InputState>().active;
        this.$emit('focus', focus);
        return focus;
    }

    private get hasIcon(): boolean {
        return !!this.iconName && this.iconName !== '';
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasAdjustWidthAutoSlot(): boolean {
        return !!this.$slots['adjust-width-auto'];
    }

    private onClick(event): void {
        this.$emit('click', event);
    }

    private onMousedown(event): void {
        this.$emit('mousedown', event);
    }

    private onMouseup(event): void {
        this.$emit('mouseup', event);
    }
}

const InputStylePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(SpinnerPlugin);
        v.component(INPUT_STYLE_NAME, MInputStyle);
    }
};

export default InputStylePlugin;
