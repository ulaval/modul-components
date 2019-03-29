import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_STYLE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import SpinnerPlugin from '../spinner/spinner';
import WithRender from './input-style.html?style=./input-style.scss';

export const CSS_LABEL_DEFAULT_MARGIN: number = 10;

@WithRender
@Component({
    mixins: [InputState]
})
export class MInputStyle extends ModulVue {
    @Prop({ default: '' })
    public label: string;
    @Prop()
    public labelFor: string;
    @Prop({ default: false })
    public focus: boolean;
    @Prop({ default: true })
    public empty: boolean;
    @Prop()
    public width: string;
    @Prop()
    public requiredMarker: boolean;
    @Prop()
    public readonly: boolean;
    @Prop({ default: false })
    public cursorPointer: boolean;

    public $refs: {
        root: HTMLElement,
        label: HTMLElement,
        body: HTMLElement,
        adjustWidthAuto: HTMLElement,
        rightContent: HTMLElement
    };

    public labelOffset: string | undefined = CSS_LABEL_DEFAULT_MARGIN + 'px';
    private animReady: boolean = false;

    protected created(): void {
        setTimeout(() => {
            this.animReady = true;
            this.setInputWidth();
        }, 0);
    }

    protected mounted(): void {
        this.calculateLabelOffset();
    }

    public setInputWidth(): void {
        // This is not very VueJs friendly.  It should be replaced by :style or something similar.
        this.$nextTick(() => {
            let labelEl: HTMLElement = this.$refs.label;
            let inputEl: HTMLElement | undefined = this.as<InputState>().getInput();
            let adjustWidthAutoEl: HTMLElement = this.$refs.adjustWidthAuto;
            if (this.width === 'auto' && this.hasAdjustWidthAutoSlot) {
                setTimeout(() => {
                    if (inputEl !== undefined) {
                        inputEl.style.width = '0px';
                        setTimeout(() => {
                            if (inputEl !== null) {
                                let width: number = adjustWidthAutoEl.clientWidth < 50 ? 50 : adjustWidthAutoEl.clientWidth;
                                if (this.hasLabel) {
                                    width = !this.isLabelUp && (labelEl.clientWidth > width) ? labelEl.clientWidth : width;
                                }
                                inputEl!.style.width = width + 'px';
                            }
                        }, 0);
                    }
                }, 0);

            } else if (inputEl) {
                if (inputEl.style.width) {
                    inputEl.style.removeProperty('width');
                }
            }
        });
    }

    @Watch('isLabelUp')
    private calculateLabelOffset(): void {
        if (this.label) {
            if (this.isLabelUp) {
                let label: HTMLElement | null = this.$refs.label;
                let rootStyle: any = window.getComputedStyle(this.$refs.root);
                if (label) {
                    let labelOffset: number = label.clientHeight / 2;
                    this.labelOffset = labelOffset > CSS_LABEL_DEFAULT_MARGIN ? `${labelOffset}px` : `${CSS_LABEL_DEFAULT_MARGIN}px`;
                }
            } else {
                this.labelOffset = `${CSS_LABEL_DEFAULT_MARGIN}px`;
            }
        } else {
            this.labelOffset = undefined;
        }
    }

    public get isLabelUp(): boolean {
        return (this.hasValue || (this.isFocus && this.hasValue)) && this.hasLabel;
    }

    private get hasValue(): boolean {
        return this.hasDefaultSlot && !this.empty;
    }

    private get hasLabel(): boolean {
        return !!this.label && this.label !== '';
    }

    private get isFocus(): boolean {
        let focus: boolean = this.focus && this.as<InputState>().active;
        this.$emit('focus', focus);
        return focus;
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
        v.use(I18nPlugin);
        v.use(SpinnerPlugin);
        v.component(INPUT_STYLE_NAME, MInputStyle);
    }
};

export default InputStylePlugin;
