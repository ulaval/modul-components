import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';
import { DATEFIELDS_NAME } from '../component-names';
import DropdownPlugin from '../dropdown/dropdown';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import SpinnerPlugin from '../spinner/spinner';
import WithRender from './datefields.html?style=./datefields.scss';


const VIEW_DATE: string = 'date';
const VIEW_MONTH: string = 'month';
const VIEW_YEAR: string = 'year';

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MDatefields extends ModulVue {
    @Model('change')
    @Prop()
    public value: moment.Moment | Date | undefined;
    @Prop({ default: 1900 })
    public minYear: number;
    @Prop({ default: moment().year() + 5 })
    public maxYear: number;
    @Prop({ default: true })
    public year: boolean;
    @Prop({ default: true })
    public month: boolean;
    @Prop({ default: true })
    public date: boolean;

    private months: number = 12;

    // Model
    private internalYear: number | undefined = 0;
    private internalMonth: number | undefined = 0;
    private internalDate: number | undefined = 0;

    protected created(): void {
        moment.locale([this.$i18n.currentLang(), 'en-ca']);
        this.setInternal(this.value);
    }

    @Watch('value')
    private setInternal(value: moment.Moment | Date | undefined): void {
        let valueYear: number | undefined = !value ? undefined : value instanceof Date ? value.getFullYear() : value.year();

        if (!valueYear || (valueYear >= this.minYear && valueYear <= this.maxYear)) {
            this.internalYear = valueYear;
            this.internalMonth = !value ? undefined : value instanceof Date ? value.getMonth() + 1 : value.month() + 1;
            this.internalDate = !value ? undefined : value instanceof Date ? value.getDate() : value.date();
        } else {
            console.error(this.$i18n.translate('m-datefields:year-out-of-range'));
            this.internalYear = undefined;
            this.internalMonth = undefined;
            this.internalDate = undefined;
        }
    }

    private get years(): number[] {
        let yearsRanges: number[] = [];

        if (this.year) {
            let currentYear: number = this.minYear;

            if (this.minYear <= this.maxYear) {
                while (currentYear <= this.maxYear) {
                    yearsRanges.push(currentYear);
                    currentYear++;
                }
            } else {
                console.error(this.$i18n.translate('m-datefields:year-range-error'));
            }
        }

        return yearsRanges;
    }

    private get dates(): number {
        let value: number = 31;

        if (this.date && this.internalMonth) {
            value = moment(`${this.internalYear ? this.internalYear : 2000}-${this.internalMonth}`, 'YYYY-MM').daysInMonth();
        }

        return value;
    }

    private get complete(): boolean {
        return !!((!this.year || (this.year && this.internalYear)) &&
            (!this.month || (this.month && this.internalMonth)) &&
            (!this.date || (this.date && this.internalDate)));
    }

    private emitDate(): void {
        let date: object = {};
        let emitValue: boolean = true;
        let model: moment.Moment | Date | undefined = undefined;

        if (this.complete) {
            if (this.year && this.internalYear) {
                date[VIEW_YEAR] = this.internalYear;
            }
            if (this.month && this.internalMonth) {
                date[VIEW_MONTH] = this.internalMonth - 1;
            }
            if (this.date && this.internalDate) {
                if (this.internalDate <= moment(`${this.year && this.internalYear ? this.internalYear : 2000}-${this.month && this.internalMonth ? this.internalMonth : 1}`, 'YYYY-MM').daysInMonth()) {
                    date[VIEW_DATE] = this.internalDate;
                } else {
                    this.internalDate = undefined;
                    emitValue = false;
                }
            }

            if (emitValue) {
                model = this.value instanceof Date ? moment(date).toDate() : moment(date);
                this.$emit('change', model);
            }
        }

        this.$emit('complete', this.complete && emitValue);
    }

    private getMonthLabel(value: number): string {
        return moment().month(value - 1).format('MMMM');
    }

    private getDateLabel(value: number): string {
        let strValue: string = value.toString();
        if (strValue.length === 1) {
            strValue = '0' + strValue;
        }
        return strValue;
    }

    private getPlaceholder(key: string): string {
        return this.$i18n.translate('m-datefields:' + key);
    }
}

const DatefieldsPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MDatefields will be deprecated in modul v.1.0');

        Vue.use(DropdownPlugin);
        Vue.use(I18nPlugin);
        Vue.use(IconButtonPlugin);
        Vue.use(SpinnerPlugin);
        v.component(DATEFIELDS_NAME, MDatefields);
    }
};

export default DatefieldsPlugin;
