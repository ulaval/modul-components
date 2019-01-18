import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PERIODPICKER_NAME } from '../component-names';
import { MDateRange } from './periodpicker';
import WithRender from './periodpicker.sandbox.html';

@WithRender
@Component
export class MPeriodpickerSandbox extends Vue {
    from: any = undefined;
    to: any = undefined;

    model: MDateRange = { to: this.to, from: this.from };

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
        v.component(`${PERIODPICKER_NAME}-sandbox`, MPeriodpickerSandbox);
    }
};

export default PeriodpickerSandboxPlugin;
