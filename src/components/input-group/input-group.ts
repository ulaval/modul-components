import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_GROUP_NAME } from '../component-names';
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

    @Prop({ default: false })
    disabled: boolean;

    @Prop({ default: false })
    waiting: boolean;

    @Prop({ default: false })
    readonly: boolean;

    @Prop()
    valid: boolean;

    @Prop()
    error: boolean;

    @Prop()
    errorMessage: string;

    @Prop()
    validMessage: string;

    @Prop()
    helperMessage: string;

    @Prop({ default: true })
    displayValidation: boolean;

    get isDisabled(): boolean {
        return this.disabled;
    }

    get isWaiting(): boolean {
        return this.waiting;
    }

    get hasError(): boolean {
        return this.error || !!this.errorMessage;
    }

    get isReadonly(): boolean {
        return this.readonly;
    }

    get errorMessageInputGroup(): string {
        return this.errorMessage;
    }

    get isValid(): boolean {
        return this.valid || !!this.validMessage;
    }

    get validMessageInputGroup(): string {
        return this.validMessage;
    }

    get helperMessageInputGroup(): string {
        return this.helperMessage;
    }

    get hasValidationMessage(): boolean {
        return !!this.errorMessageInputGroup
            || !!this.validMessageInputGroup
            || !!this.helperMessage;
    }

    get classes(): { [name: string]: boolean } {
        return {
            'm--is-readonly': this.isReadonly,
            'm--is-disabled': this.isDisabled,
            'm--is-waiting': this.isWaiting,
            'm--has-error': this.hasError,
            'm--is-valid': this.isValid,
            'm--has-validation-message': this.hasValidationMessage,
            'm--border-hidden': !this.visible
        };
    }
}


const InputGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        // v.prototype.$log.debug(INPUT_GROUP_NAME, 'plugin.install');
        v.prototype.$log.warn(INPUT_GROUP_NAME + ' is not ready for production');
        v.component(INPUT_GROUP_NAME, MInputGroup);
    }
};

export default InputGroupPlugin;
