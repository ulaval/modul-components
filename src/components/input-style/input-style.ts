import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
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
    @Prop({ default: false })
    public append: boolean;
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
    @Prop({ default: false })
    public labelUp: boolean;

    public $refs: {
        root: HTMLElement,
        label: HTMLElement,
        body: HTMLElement,
        adjustWidthAuto: HTMLElement,
        suffix: HTMLElement
    };

    public labelOffset: string | undefined = CSS_LABEL_DEFAULT_MARGIN + 'px';
    public suffixOffset: string | undefined = '0px';
    public animReady: boolean = false;

    protected created(): void {
        setTimeout(() => {
            this.animReady = true;
            this.setInputWidth();
        }, 0);
    }

    protected mounted(): void {
        this.computeLabelOffset();
        this.computeSuffixOffset();
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
    private computeLabelOffset(): void {
        if (this.label) {
            let labelOffset: number = this.$refs.label.clientHeight / 2;
            this.labelOffset = this.isLabelUp && labelOffset > CSS_LABEL_DEFAULT_MARGIN ? `${labelOffset}px` : `${CSS_LABEL_DEFAULT_MARGIN}px`;
        } else {
            this.labelOffset = undefined;
        }
    }

    public async computeSuffixOffset(): Promise<void> {
        await this.$nextTick();
        if (this.label && this.$refs.suffix) {
            this.suffixOffset = this.$refs.suffix.clientWidth + 'px';
        } else {
            this.suffixOffset = undefined;
        }
    }

    public get isLabelUp(): boolean {
        return (this.hasValue || (this.isFocus && this.hasValue) || this.labelUp) && this.hasLabel;
    }

    public get showPrefix(): boolean {
        return this.hasLabel ? this.isFocus : true;
    }

    private get hasValue(): boolean {
        return this.hasDefaultSlot && !this.empty;
    }

    public get hasLabel(): boolean {
        return !!this.label && this.label !== '';
    }

    public get isFocus(): boolean {
        let focus: boolean = this.focus && this.as<InputState>().active;
        this.$emit('focus', focus);
        return focus;
    }

    public get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    public get hasAdjustWidthAutoSlot(): boolean {
        return !!this.$slots['adjust-width-auto'];
    }

    @Emit('click')
    public onClick(event): void { }

    @Emit('mousedown')
    public onMousedown(event): void { }

    @Emit('mouseup')
    public onMouseup(event): void { }
}

const InputStylePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.use(SpinnerPlugin);
        v.component(INPUT_STYLE_NAME, MInputStyle);
    }
};

export default InputStylePlugin;
