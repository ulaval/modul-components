import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { TIMEPICKER_NAME } from '../component-names';
import TimepickerPlugin from './timepicker';
import WithRender from './timepicker.sandbox.html';

@WithRender
@Component
export class MTimepickerSandbox extends Vue {

    model: string = '';

    private mounted(): void {
        setTimeout(() => {
            this.model = '12:05';
        }, 3000);
    }

}

const TimepickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TimepickerPlugin);
        v.component(`${TIMEPICKER_NAME}-sandbox`, MTimepickerSandbox);
    }
};

export default TimepickerSandboxPlugin;
