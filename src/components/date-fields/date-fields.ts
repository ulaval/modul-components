import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './date-fields.html?style=./date-fields.scss';
import { DATEFIELDS_NAME } from '../component-names';
import * as moment from 'moment';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import i18nPlugin from '../../utils/i18n/i18n';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { currentId } from 'async_hooks';

const VIEW_DATE = 'date';
const VIEW_MONTH = 'month';
const VIEW_YEAR = 'year';

@WithRender
@Component({
    mixins: [
        InputState,
        InputPopup,
        MediaQueries
    ]
})
export class MDateFields extends ModulVue {
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
    @Prop()
    public disabled: boolean;

    private months: number = 12;

    // Model
    private internalYear: number | undefined = 0;
    private internalMonth: number | undefined = 0;
    private internalDate: number | undefined = 0;

    // protected created(): void {
    //     this.setInternal(this.value);
    // }

    @Watch('value')
    private setInternal(value: moment.Moment | Date | undefined): void {
        let valueYear = !value ? undefined : value instanceof Date ? value.getFullYear() : value.year();

        if (!valueYear || (valueYear >= this.minYear && valueYear <= this.maxYear)) {
            this.internalYear = valueYear;
            this.internalMonth = !value ? undefined : value instanceof Date ? value.getMonth() + 1 : value.month() + 1;
            this.internalDate = !value ? undefined : value instanceof Date ? value.getDate() : value.date();
        } else {
            console.error(this.$i18n.translate('m-date-fields:year-out-of-range'));
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
                console.error(this.$i18n.translate('m-date-fields:year-range-error'));
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
        if (this.complete) {

            let emit: boolean = true;
            let date: object = {};

            if (this.year && this.internalYear) {
                date['year'] = this.internalYear;
            }
            if (this.month && this.internalMonth) {
                date['month'] = this.internalMonth - 1;
            }
            if (this.date && this.internalDate) {
                if (this.internalDate <= moment(`${this.year && this.internalYear ? this.internalYear : 2000}-${this.month && this.internalMonth ? this.internalMonth : 1}`, 'YYYY-MM').daysInMonth()) {
                    date['date'] = this.internalDate;
                } else {
                    this.internalDate = undefined;
                    emit = false;
                }
            }

            if (emit) {
        //     // this.model = value ? (value instanceof Date ? moment(value) : value) : undefined;

                let model: moment.Moment | undefined = moment(date);
                this.$emit('change', model);
            }
        }
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
        return this.$i18n.translate('m-date-fields:' + key);
    }
}

const DateFieldsPlugin: PluginObject<any> = {
    install(v, options) {
        // Vue.use(DropdownItemPlugin);
        // Vue.use(InputStylePlugin);
        // Vue.use(ButtonPlugin);
        // Vue.use(PopupPlugin);
        // Vue.use(ValidationMessagePlugin);
        // Vue.use(MediaQueriesPlugin);
        // Vue.use(i18nPlugin);
        v.component(DATEFIELDS_NAME, MDateFields);
    }
};

export default DateFieldsPlugin;
