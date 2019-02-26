import Vue, { PluginObject } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ModulPeriod, PeriodFilter, PeriodFilterParams } from '../../filters/date/period/period';
import { PERIOD } from '../component-names';
import WithRender from './period.html';

@WithRender
@Component
export class MPeriod extends Vue {
    @Prop()
    period: ModulPeriod;

    @Prop({ default: false })
    fullMode: boolean;

    get formattedPeriod(): string {
        const params: PeriodFilterParams = {
            fullMode: this.fullMode,
            period: this.period
        };
        return PeriodFilter.formatPeriod(params);
    }
}

const PeriodPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(PERIOD, MPeriod);
    }
};

export default PeriodPlugin;
