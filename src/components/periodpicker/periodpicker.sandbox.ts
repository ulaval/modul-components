import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PERIODPICKER_NAME } from '../component-names';
import DatepickerPlugin from '../datepicker/datepicker';
import PeriodpickerPlugin, { MDateRange } from './periodpicker';
import WithRender from './periodpicker.sandbox.html';

@WithRender
@Component
export class MPeriodpickerSandbox extends Vue {
    from: any = undefined;
    to: any = undefined;

    fromDefaultStringValue: string = '2019-02-20T05:00:00.000Z';
    toDefaultStringValue: string = '2019-03-01T04:59:59.999Z';

    fromDefaultDateValue: Date = new Date('2019-02-20T05:00:00.000Z');
    toDefaultDateValue: Date = new Date('2019-03-01T04:59:59.999Z');

    errorMessage: string = '';
    validMessage: string = '';
    helperMessage: string = '';
    waiting: boolean = false;
    disabled: boolean = false;
    readonly: boolean = false;
    error: boolean = false;

    model: MDateRange = new MDateRange(this.from, this.to);
    defaultStringValueModel: MDateRange = new MDateRange(this.fromDefaultStringValue, this.toDefaultStringValue);
    defaultDateValueModel: MDateRange = new MDateRange(this.fromDefaultDateValue, this.toDefaultDateValue);

    get min(): Date {
        const date: Date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    get max(): Date {
        const date: Date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    emptyModel(emptyWith: any): void {
        this.model = emptyWith;
    }
}

const PeriodpickerSandboxPlugin: PluginObject<any> = {
    install(v): void {
        v.use(DatepickerPlugin);
        v.use(PeriodpickerPlugin);
        v.component(`${PERIODPICKER_NAME}-sandbox`, MPeriodpickerSandbox);
    }
};

export default PeriodpickerSandboxPlugin;
