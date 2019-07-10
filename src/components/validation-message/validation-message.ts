import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import { VALIDATION_MESSAGE_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import AccordionTransitionPlugin from '../transitions/accordion-transition/accordion-transition';
import WithRender from './validation-message.html?style=./validation-message.scss';

@WithRender
@Component({
    mixins: [InputState]
})
export class MValidationMessage extends ModulVue {
    @Prop({ default: true })
    public transition: boolean = true;

    public svgTitle: string;
    public iconName: string;
    public classMessage: string = '';

    @Emit('click')
    public onClick(event: Event): void { }

    public get message(): string | undefined {
        let message: string | undefined;
        if (this.as<InputState>().hasErrorMessage && this.as<InputState>().hasError) {
            this.classMessage = 'error';
            this.svgTitle = this.$i18n.translate('m-validation-message:title-error-icon');
            this.iconName = 'm-svg__error';
            message = this.as<InputState>().errorMessage;
        }

        if (this.as<InputState>().hasValidMessage && this.as<InputState>().isValid) {
            this.classMessage = 'valid';
            this.svgTitle = this.$i18n.translate('m-validation-message:title-valid-icon');
            this.iconName = 'm-svg__confirmation';
            message = this.as<InputState>().validMessage;
        }

        return message;
    }
}

const ValidationMessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(AccordionTransitionPlugin);
        v.component(VALIDATION_MESSAGE_NAME, MValidationMessage);
    }
};

export default ValidationMessagePlugin;
