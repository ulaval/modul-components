import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './validation-message.html?style=./validation-message.scss';
import { VALIDATION_MESSAGE_NAME } from '../component-names';
import { InputState } from '../../mixins/input-state/input-state';
import IconPlugin from '../icon/icon';

@WithRender
@Component({
    mixins: [InputState]
})
export class MValidationMessage extends ModulVue {
    private titleErrorIcon: string = this.$i18n.translate('m-validation-message:title-error-icon');
    private titleValidIcon: string = this.$i18n.translate('m-validation-message:title-valid-icon');

    private onClick(event: MouseEvent): void {
        this.$emit('click', event);
    }
}

const ValidationMessagePlugin: PluginObject<any> = {
    install(v, options) {
        v.use(IconPlugin);
        v.component(VALIDATION_MESSAGE_NAME, MValidationMessage);
    }
};

export default ValidationMessagePlugin;
