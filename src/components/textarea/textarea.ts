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
    @Prop({ default: '720px' })
    public maxWidth: string;
    @Prop({ default: 3 })
    public rows: number;
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
