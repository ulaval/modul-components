import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './validation-message.html?style=./validation-message.scss';
import { VALIDATION_MESSAGE_NAME } from '../component-names';

const STATE_DEFAULT = 'default';
const STATE_DISABLED = 'disabled';

@WithRender
@Component
export class MValidationMessage extends ModulVue {
    @Prop({ default: STATE_DEFAULT })
    public state: string;
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;
    @Prop({ default: '' })
    public validMessage: string;

    public componentName = VALIDATION_MESSAGE_NAME;

    private titleErrorIcon: string = this.$i18n.translate('m-validation-message:title-error-icon');
    private titleValidIcon: string = this.$i18n.translate('m-validation-message:title-valid-icon');

    private get propsState(): string {
        return this.state == STATE_DISABLED ? STATE_DEFAULT : STATE_DEFAULT;
    }

    private get isDiabled(): boolean {
        return this.state == STATE_DISABLED;
    }

    private get hasError(): boolean {
        return !this.isDiabled && this.errorMessage != '';
    }

    private get hasHelper(): boolean {
        return !this.isDiabled && this.helperMessage != '';
    }

    private get isValid(): boolean {
        return !this.isDiabled && this.validMessage != '' && !this.hasError;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(VALIDATION_MESSAGE_NAME, MValidationMessage);
    }
};

export default ButtonPlugin;
