import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './textarea.html?style=./textarea.scss';
import { TEXTAREA_NAME } from '../component-names';
import { InputState } from '../../mixins/input-state/input-state';
import { InputManagement } from '../../mixins/input-management/input-management';
import { KeyCode } from '../../utils/keycode/keycode';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement
    ]
})
export class MTextarea extends ModulVue {
    @Prop()
    public maxlength: number;
    @Prop({ default: '100%' })
    public width: string;
    @Prop({ default: '420px' })
    public maxWidth: string;

    private internalTextareaError: boolean = false;
    private textareaHeight: string;

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

    private onKeydown(event): void {
        let el: HTMLElement = (this.$refs.input as HTMLElement);
        setTimeout(() => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
