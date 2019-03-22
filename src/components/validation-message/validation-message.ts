import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import AccordionTransitionPlugin from '../accordion/accordion-transition';
import { VALIDATION_MESSAGE_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './validation-message.html?style=./validation-message.scss';

@WithRender
@Component({
    mixins: [InputState]
})
export class MValidationMessage extends ModulVue {
    @Prop({ default: true })
    public transition: boolean = true;

    public titleErrorIcon: string = this.$i18n.translate('m-validation-message:title-error-icon');
    public titleValidIcon: string = this.$i18n.translate('m-validation-message:title-valid-icon');

    @Emit('click')
    public onClick(event: Event): void {
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
