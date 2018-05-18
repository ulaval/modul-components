import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement, InputManagementData } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { ModulVue } from '../../utils/vue/vue';
import { TEXTAREA_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './textarea.html?style=./textarea.scss';
import uuid from '../../utils/uuid/uuid';
@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel,
        ElementQueries
    ]
})
export class MTextarea extends ModulVue implements InputManagementData {
    @Prop()
    public maxLength?: number;

    readonly internalValue: string;
    private internalTextareaHeight: string = '0';
    private id: string = `mTextarea-${uuid.generate()}`;

    protected mounted(): void {
        this.setInputHiddenStyle();
    }

    protected updated(): void {
        this.setInputHiddenStyle();
    }

    private setInputHiddenStyle(): void {
        let inputHidden: HTMLElement = this.$refs.inputHidden as HTMLElement;
        let computedElStyle: CSSStyleDeclaration = window.getComputedStyle(this.$refs.input as HTMLElement);
        inputHidden.style.fontSize = computedElStyle.fontSize;
        inputHidden.style.textTransform = computedElStyle.textTransform;
        inputHidden.style.fontWeight = computedElStyle.fontWeight;
        inputHidden.style.lineHeight = computedElStyle.lineHeight;
        inputHidden.style.padding = computedElStyle.padding;
        inputHidden.style.margin = computedElStyle.margin;
    }

    private get valueLength(): number {
        return this.internalValue.length;
    }

    public get hasMaxLength(): boolean {
        return this.maxLength ? this.maxLength > 0 : false;
    }

    private get hasTextAreaError(): boolean {
        return !this.isLengthValid || this.as<InputState>().hasError;
    }

    private get isTextAreaValid(): boolean {
        return this.isLengthValid && this.as<InputState>().isValid;
    }

    private get isLengthValid(): boolean {
        return this.maxLength
            ? this.internalValue.length < this.maxLength
            : true;
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(TEXTAREA_NAME + ' is not ready for production');
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
