import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './timepicker.html?style=./timepicker.scss';
import { TIMEPICKER_NAME } from '../component-names';
import * as moment from 'moment';
import i18nPlugin, { curLang } from '../../utils/i18n/i18n';
import { InputState } from '../../mixins/input-state/input-state';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import ButtonPlugin from '../button/button';
import InputStylePlugin, { MInputStyle } from '../input-style/input-style';
import ValidationMessagePlugin from '../validation-message/validation-message';
import PopupPlugin from '../popup/popup';

@WithRender
@Component({
    mixins: [
        InputState,
        InputPopup,
        MediaQueries
    ]
})
export class MTimepicker extends ModulVue {

    @Prop()
    public label: string;
    @Prop()
    public duration: boolean;
    @Prop({ default: function() { return this.duration ? moment.duration('1:0') : moment(); } })
    public time: moment.Moment | moment.Duration;
    @Prop({ default: function() { return this.duration ? moment.duration('0:0') : moment().hours(0).minutes(0); } })
    public min: moment.Moment | moment.Duration;
    @Prop({ default: function() { return this.duration ? moment.duration('4:0') : moment().hours(23).minutes(59); } })
    public max: moment.Moment | moment.Duration;
    @Prop({ default: 5 })
    public step: number;
    @Prop({ default: 'LT' })
    public format: string;

    private hours: object = {};
    private selectedHour: number = NaN;
    private selectedMinute: number = NaN;
    private tempHour: number = NaN;
    private tempMinute: number = NaN;
    private placeholder: string = this.$i18n.translate('m-timepicker:placeholder');
    private okButtonText: string = this.$i18n.translate('m-timepicker:button-ok');
    private isMousedown: boolean = false;
    private scrollTimeout;

    private internalOpen: boolean = false;
    private internalTimeErrorMessage: string = '';

    private mounted(): void {
        moment.locale(curLang);

        let newTime = this.duration ? moment.duration(this.min.hours() + ':' + this.min.minutes()) : moment().hours(this.min.hours()).minutes(this.min.minutes());
        while (this.isTimeSameOrBeforeMax(newTime)) {
            let hour = newTime.hours();
            if (!this.hours[hour]) this.hours[hour] = [];
            this.hours[hour].push(newTime.minutes());
            newTime.add(this.step, 'm');
        }

        let roundedTime = this.time.add(Math.round(this.time.minutes() / this.step) * this.step - this.time.minutes(), 'm');

        if (this.isTimeSameOrBeforeMax(roundedTime)) {
            if (this.isTimeSameOrAfterMin(roundedTime)) {
                this.selectedHour = roundedTime.hours();
                this.selectedMinute = roundedTime.minutes();
            } else {
                this.selectedHour = this.min.hours();
                this.selectedMinute = this.hours[this.selectedHour][0];
            }
        } else {
            this.selectedHour = this.max.hours();
            this.selectedMinute = this.hours[this.selectedHour][this.hours[this.selectedHour].length - 1];
        }

        this.tempHour = this.selectedHour;
        this.tempMinute = this.selectedMinute;
    }

    private isTimeSameOrBeforeMax(time: moment.Moment | moment.Duration): boolean {
        if (moment.isDuration(time)) {
            return time.asMilliseconds() <= (this.max as moment.Duration).asMilliseconds();
        } else {
            return moment(time).isSameOrBefore(this.max as moment.Moment, 'minute');
        }
    }

    private isTimeSameOrAfterMin(time: moment.Moment | moment.Duration): boolean {
        if (moment.isDuration(time)) {
            return time.asMilliseconds() >= (this.min as moment.Duration).asMilliseconds();
        } else {
            return moment(time).isSameOrAfter(this.min as moment.Moment, 'minute');
        }
    }

    private get minutes(): number[] {
        return this.hours[this.tempHour];
    }

    private get formattedTime(): string {
        if (this.duration) {
            this.as<InputPopup>().internalValue = this.selectedHour + ':' + this.formatMinute(this.selectedMinute);
        } else {
            this.as<InputPopup>().internalValue = moment().hours(this.selectedHour).minutes(this.selectedMinute).format(this.format);
        }
        return this.as<InputPopup>().internalValue;
    }

    private set formattedTime(value: string) {
        this.as<InputPopup>().internalValue = value;
    }

    private formatHour(hour: number): string {
        return !this.duration && hour < 10 ? '0' + hour : hour.toString();
    }

    private formatMinute(minute: number): string {
        return minute < 10 ? '0' + minute : minute.toString();
    }

    private validateTime(event, value: string): void {
        let numbers = value.match(/\d+/g);
        if (numbers && numbers.length == 2) {
            if (isNaN(Number(numbers[0])) || isNaN(Number(numbers[1]))) {
                this.internalTimeErrorMessage = this.$i18n.translate('m-timepicker:error-format');
            } else if (Number(numbers[0]) < this.min.hours() || Number(numbers[0]) > this.max.hours()
                || Number(numbers[1]) < this.min.minutes() || Number(numbers[1]) > this.max.minutes()) {
                this.internalTimeErrorMessage = this.$i18n.translate('m-timepicker:out-of-bounds-error');
            } else {
                this.selectedHour = parseInt(numbers[0], 10);
                this.selectedMinute = parseInt(numbers[1], 10);
                this.internalTimeErrorMessage = '';
                this.emitChange(this.selectedHour, this.selectedMinute);
            }
        } else {
            this.internalTimeErrorMessage = this.$i18n.translate('m-timepicker:error-format');
        }
    }

    private get timeError(): boolean {
        return this.internalTimeErrorMessage != '' || this.as<InputState>().hasError;
    }

    private get timeErrorMessage(): string {
        return this.as<InputState>().errorMessage != undefined ? this.as<InputState>().errorMessage : this.internalTimeErrorMessage;
    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private set open(open: boolean) {
        this.internalOpen = open;
        this.$nextTick(() => {
            if (this.internalOpen) {
                let inputEl: any = this.$refs.input;
                inputEl.focus();
                inputEl.setSelectionRange(0, this.formattedTime.length);
                this.scrollToSelection(this.$refs.hours as HTMLElement);
                this.scrollToSelection(this.$refs.minutes as HTMLElement);
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    private scrollToSelection(container: HTMLElement): void {
        let selectedElement = container.querySelector('.m--is-selected');
        setTimeout(function() {
            if (selectedElement) {
                container.scrollTop = selectedElement['offsetTop'] - container.clientHeight / 2 + selectedElement.clientHeight / 2;
            }
        }, 10);
    }

    private onScroll(event: Event): void {
        if (!this.isMousedown) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                if (event.srcElement) this.positionScroll(event.srcElement);
            }, 300);
        }
    }

    private onMousedown(event: Event): void {
        this.isMousedown = true;
    }

    private onMouseup(event: Event): void {
        this.isMousedown = false;
        if (event.srcElement) this.positionScroll(event.srcElement);
    }

    private positionScroll(el: Element): void {
        el.scrollTop = Math.round(el.scrollTop / 44) * 44;
    }

    private selectHour(hour: number): void {
        this.tempHour = hour;
    }

    private selectMinute(minute: number): void {
        this.tempMinute = minute;
    }

    private onOk(): void {
        this.selectedHour = this.tempHour;
        this.selectedMinute = this.tempMinute;
        this.emitChange(this.selectedHour, this.selectedMinute);
        this.open = false;
    }

    private emitChange(hour: number, minute: number): void {
        if (this.duration) {
            this.$emit('change', moment.duration(hour + ':' + minute));
        } else {
            this.$emit('change', moment().hours(hour).minutes(minute));
        }
    }
}

const TimepickerPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStylePlugin);
        v.use(ButtonPlugin);
        v.use(PopupPlugin);
        v.use(ValidationMessagePlugin);
        v.use(MediaQueriesPlugin);
        v.use(i18nPlugin);
        v.component(TIMEPICKER_NAME, MTimepicker);
    }
};

export default TimepickerPlugin;
