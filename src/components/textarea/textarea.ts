import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { ModulVue } from '../../utils/vue/vue';
import { TEXTAREA_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import TextareaResizePlugin from '../textarea-resize/textarea-resize';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './textarea.html?style=./textarea.scss';

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
export class MTextarea extends ModulVue {
    @Prop()
    public maxlength: number;

    private internalTextareaError: boolean = false;
    private textareaHeight: string;

    protected mounted(): void {
        this.as<ElementQueries>().$on('resize', this.resizeInput);
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.resizeInput);
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

    private resizeInput(): void {
      //  (this.$refs.textarea as MTextareaResize).resize();
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(TEXTAREA_NAME + ' is not ready for production');
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.use(TextareaResizePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
