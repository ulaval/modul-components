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
    public characterCount: boolean;
    @Prop({ default: Infinity })
    public maxLength: number;
    @Prop({ default: true })
    public lengthOverflow: boolean;
    @Prop({ default: 0 })
    public threshold: number;

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

    private get maxLengthNumber(): number {
        return !this.lengthOverflow && this.maxLength > 0 ? this.maxLength : Infinity ;
    }

    private get hasTextareaError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isTextareaValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get hasCounterTransition(): boolean {
        return !this.as<InputState>().hasErrorMessage;
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
