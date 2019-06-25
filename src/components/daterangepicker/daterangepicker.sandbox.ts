import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { DATERANGEPICKER_NAME } from '../component-names';
import { MDateRange } from '../periodpicker/periodpicker';
import DaterangepickerPlugin from './daterangepicker';
import WithRender from './daterangepicker.sandbox.html';

@WithRender
@Component
export class MDaterangepickerSandbox extends Vue {
    from: any = undefined;
    to: any = undefined;
    model: MDateRange = new MDateRange(this.from, this.to);
    errorMessage: string = '';
    validMessage: string = '';
    helperMessage: string = '';
    waiting: boolean = false;
    disabled: boolean = false;
    readonly: boolean = false;
    error: boolean = false;

    emptyModel(emptyWith: any): void {
        this.model = emptyWith;
    }
}

const DaterangepickerSandboxPlugin: PluginObject<any> = {
    install(v): void {
        v.use(DaterangepickerPlugin);
        v.component(`${DATERANGEPICKER_NAME}-sandbox`, MDaterangepickerSandbox);
    }
};

export default DaterangepickerSandboxPlugin;
