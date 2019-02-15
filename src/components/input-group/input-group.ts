import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { INPUT_GROUP_NAME } from '../component-names';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import { InputState } from './../../mixins/input-state/input-state';
import { ModulVue } from './../../utils/vue/vue';
import WithRender from './input-group.html?style=./input-group.scss';


@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement
    ]
})
export class MInputGroup extends ModulVue {

    @Prop({ default: true })
    visible: boolean;

    @Prop()
    legend: string;

    @Prop({ default: true })
    displayValidation: boolean;

    get classes(): { [name: string]: boolean } {
        return {
            'm--is-readonly': this.as<InputState>().readonly,
            'm--is-disabled': this.as<InputState>().isDisabled,
            'm--is-waiting': this.as<InputState>().isWaiting,
            'm--has-error': this.as<InputState>().hasError,
            'm--is-valid': this.as<InputState>().isValid,
            'm--has-validation-message': this.as<InputState>().hasValidationMessage,
            'm--border-hidden': !this.visible
        };
    }
}


const InputGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(INPUT_GROUP_NAME, 'plugin.install');
        v.component(INPUT_GROUP_NAME, MInputGroup);
        v.use(ValidationMessagePlugin);
    }
};

export default InputGroupPlugin;
