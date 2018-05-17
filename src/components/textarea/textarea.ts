import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import TextAreaAutoHeightPlugin from '../../directives/textarea-auto-height/textarea-auto-height';
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
    @Prop({ default: true })
    public lengthOverflow: boolean;

    readonly internalValue: string;

    private get valueLength(): number {
        return this.internalValue.length;
    }
    private get maxLengthNumber(): number | undefined {
        return !this.lengthOverflow && this.maxLength && this.maxLength > 0 ? this.maxLength : undefined ;
    }

    private get hasMaxLength(): boolean {
        return this.maxLength ? this.maxLength > 0 : false;
    }

    private get hasInputError(): boolean {
        return !this.isLengthValid || this.as<InputState>().hasError;
    }

    private get isInputValid(): boolean {
        return this.isLengthValid && this.as<InputState>().isValid;
    }

    private get isLengthValid(): boolean {
        return this.maxLength
            ? this.internalValue.length <= this.maxLength
            : true;
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(TEXTAREA_NAME + ' is not ready for production');
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.use(TextAreaAutoHeightPlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
