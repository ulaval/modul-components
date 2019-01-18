import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { DATEPICKER_NAME } from '../component-names';
import WithRender from './datepicker.sandbox.html';


@WithRender
@Component
export class MDatepickerSandbox extends ModulVue {
    private model: string = '';
    private errorMessage: string = '';

    private addMessageError(): void {
        this.errorMessage = 'Datepicker error on blur';
    }

    private onOpen(): void {
        this.$log.log('$emit(\'open\') datepicker');
    }

    private onClose(): void {
        this.$log.log('$emit(\'close\') datepicker');
    }
}

const DatepickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DATEPICKER_NAME}-sandbox`, MDatepickerSandbox);
    }
};

export default DatepickerSandboxPlugin;
