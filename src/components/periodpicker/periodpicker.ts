import moment from 'moment';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { PERIODPICKER_NAME } from '../component-names';
import DatepickerPlugin from '../datepicker/datepicker';
import WithRender from './periodpicker.html';

export class MDateRange {
    from: moment.Moment | Date;
    to: moment.Moment | Date;
}

@WithRender
@Component
export class MPeriodPicker extends ModulVue {
    from: any = '2018-11-16T05:00:00.000Z';
    to: any = '2018-11-16T05:00:00.000Z';
}

const PeriodpickerPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DatepickerPlugin);
        v.component(PERIODPICKER_NAME, MPeriodPicker);
    }
};

export default PeriodpickerPlugin;
