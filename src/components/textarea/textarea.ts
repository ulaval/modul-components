import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './textarea.html?style=./textarea.scss';
import { TEXTAREA_NAME } from '../component-names';
import { InputState } from '../../mixins/input-state/input-state';
import { InputManagement } from '../../mixins/input-management/input-management';
import { KeyCode } from '../../utils/keycode/keycode';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import { InputWidth, InputMaxWidth } from '../../mixins/input-width/input-width';

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement,
        InputWidth
    ]
})
export class MTextarea extends ModulVue {
    @Prop()
    public maxlength: number;

    private internalTextareaError: boolean = false;
    private textareaHeight: string;

    protected mounted(): void {
        this.adjustHeight();
    }

    @Watch('value')
    private valueChanged() {
        this.adjustHeight();
    }

    private get valueLenght(): number {
        let lenght: number = this.as<InputManagement>().internalValue.length;
        if (lenght > this.maxlength) {
            this.internalTextareaError = true;
        } else {
            this.internalTextareaError = false;
        }
        return lenght;
    }

    private get hasMaxlenght(): boolean {
        return this.maxlength > 0;
    }

    private get textareaError(): boolean {
        return this.internalTextareaError || this.as<InputState>().hasError;
    }

    private get textareaValid(): boolean {
        return !this.textareaError && this.as<InputState>().isValid;
    }

    private adjustHeight(): void {
        let el: HTMLElement = (this.$refs.input as HTMLElement);
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options) {
        console.warn(TEXTAREA_NAME + ' is not ready for production');
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
