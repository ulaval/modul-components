import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulPeriod } from '../../filters/date/period/period';
import { PERIOD } from '../component-names';
import TextfieldPlugin from '../textfield/textfield';
import PeriodPlugin from './period';
import WithRender from './period.sandbox.html';

@WithRender
@Component
export class MPeriodSandbox extends Vue {
    now: Date = new Date();
    year: number = this.now.getFullYear();
    month: number = this.now.getMonth() + 1;
    day: number = this.now.getDay();

    yearLater: number = this.year;
    monthLater: number = this.month;
    dayLater: number = this.day + 1;

    get period(): ModulPeriod {
        return {
            start: this.startDate,
            end: this.endDate
        };
    }

    get periodNoEnd(): ModulPeriod {
        return {
            start: this.startDate
        };
    }

    get periodNoStart(): ModulPeriod {
        return {
            end: this.endDate
        };
    }

    get startDate(): Date {
        return new Date(this.year, this.month, this.day);
    }

    get endDate(): Date {
        return new Date(this.yearLater, this.monthLater, this.dayLater);
    }
}

const MPeriodSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PeriodPlugin);
        v.use(TextfieldPlugin);
        v.component(`${PERIOD}-sandbox`, MPeriodSandbox);
    }
};

export default MPeriodSandboxPlugin;
