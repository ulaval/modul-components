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
export class MTextarea extends ModulVue implements InputManagementData {
    @Prop()
    public maxLength?: number;

    readonly internalValue: string;

    // protected mounted(): void {
        // this.as<ElementQueries>().$on('resize', this.resizeInput);
    // }

    // protected beforeDestroy(): void {
        // this.as<ElementQueries>().$off('resize', this.resizeInput);
    // }

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

    // private resizeInput(): void {
        //  (this.$refs.textarea as MTextareaResize).resize();
    // }
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
