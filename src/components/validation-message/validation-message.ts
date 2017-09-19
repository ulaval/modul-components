import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './validation-message.html?style=./validation-message.scss';
import { VALIDATION_MESSAGE_NAME } from '../component-names';
import { InputState } from '../../mixins/input-state/input-state';

@WithRender
@Component({
    mixins: [InputState]
})
export class MValidationMessage extends ModulVue {
    public componentName = VALIDATION_MESSAGE_NAME;

    private titleErrorIcon: string = this.$i18n.translate('m-validation-message:title-error-icon');
    private titleValidIcon: string = this.$i18n.translate('m-validation-message:title-valid-icon');

    private get hasError(): boolean {
        return this.as<InputState>().propErrorMessage != undefined;
    }

    private get isValid(): boolean {
        return this.as<InputState>().propValidMessage != undefined;
    }

    private get hasHelper(): boolean {
        return this.as<InputState>().propHelperMessage != undefined;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(VALIDATION_MESSAGE_NAME, MValidationMessage);
    }
};

export default ButtonPlugin;
