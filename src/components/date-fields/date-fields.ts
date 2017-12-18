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
    @Prop()
    public initEmpty: boolean;

    private months: number = 12;

    private activeYear: number | undefined = 0;
    private activeMonth: number | undefined = 0;
    private activeDate: number | undefined = 0;

    private model: moment.Moment | undefined;

    protected created(): void {
        // Nécessaire pour rendre réactif ET égale à undefined si value est non défini
        this.setModel(this.value);
    }

    @Watch('value')
    private setModel(value: moment.Moment | Date | undefined): void {
        let valueYear = !value ? undefined : value instanceof Date ? value.getFullYear() : value.year();

        if (!this.initEmpty
            && (!valueYear || (valueYear >= this.minYear && valueYear <= this.maxYear))) {
            this.model = value ? (value instanceof Date ? moment(value) : value) : undefined;
            this.activeYear = valueYear;
            this.activeMonth = !value ? undefined : value instanceof Date ? value.getMonth() + 1 : value.month() + 1;
            this.activeDate = !value ? undefined : value instanceof Date ? value.getDate() : value.date();
        } else {
            if (!this.initEmpty) {
                console.error(this.$i18n.translate('m-date-fields:year-out-of-range'));
            }
            this.model = undefined;
            this.activeYear = undefined;
            this.activeMonth = undefined;
            this.activeDate = undefined;
        }
    }

    // private get activeYear(): number | undefined {
    //     return !this.model ? undefined : this.model instanceof Date ? this.model.getFullYear() : this.model.year();
    // }

    // private set activeYear(value: number | undefined) {

    // }

    // private get model(): moment.Moment | undefined {
    //     return this.value ? undefined : this.value instanceof Date ? moment(this.value) : this.value);
    // }

    // private set model(value: moment.Moment | undefined) {

    // }

    // @Watch('value')
    // private setInternalDateValues(value: moment.Moment | Date | undefined): void {
    //     console.log('watch');
    // }

    // @Watch('activeYear')
    // @Watch('activeMonth')
    // @Watch('activeDate')
    // private emitDate(): void {
    //     console.log('EMIT');
    //     let date: object = {};

    //     if (this.year && this.activeYear) {
    //         date['year'] = this.activeYear;
    //     }
    //     if (this.month && this.activeMonth) {
    //         date['month'] = this.activeMonth - 1;
    //     }
    //     if (this.date && this.activeDate) {
    //         date['date'] = this.activeDate;
    //     }

    //     if (date !== {}) {
    //         console.log('EMIT : Done');
    //         this.$emit('change', moment(date));
    //     }
    // }

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

        if (this.date && this.activeMonth) {
            value = moment(`${this.activeYear ? this.activeYear : 2012}-${this.activeMonth}`, 'YYYY-MM').daysInMonth();
        }

        return value;
    }

    private updateInternal(): void {
        let date: object = {};

        if (this.year && this.activeYear) {
            date['year'] = this.activeYear;
        }
        if (this.month && this.activeMonth) {
            date['month'] = this.activeMonth - 1;
        }
        if (this.date && this.activeDate) {
            date['date'] = this.activeDate;
        }

        if (date !== {}) {
            this.model = moment(date);
            this.$emit('change', this.model);
        }

        console.log('internal');
    }

    private getLabel(value: number): string {
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
