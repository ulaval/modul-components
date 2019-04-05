import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
import { InputMaxWidth, InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { FormatMode } from '../../utils/i18n/i18n';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { TIMEPICKER_NAME } from '../component-names';
import InputStylePlugin from '../input-style/input-style';
import PopupPlugin from '../popup/popup';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import WithRender from './timepicker.html?style=./timepicker.scss';

const MAXIMUM_HOURS: number = 23;
const MAXIMUM_MINUTES: number = 59;
const MINUTE_SECONDS: number = 60;

export interface TimeObject {
    hour: number;
    minute: number;
    seconde?: number;
}

function validateTimeString(value: string): boolean {
    const regex: RegExp = /(\d\d):(\d\d)/g;
    return value.match(regex) || !value.length ? true : false;
}

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement,
        InputPopup,
        InputWidth,
        MediaQueries
    ]
})
export class MTimepicker extends ModulVue {

    @Prop({
        validator(value: string): boolean {
            return validateTimeString(value);
        }
    })
    @Model('input')
    public value: string;
    @Prop({ default: '00:00' })
    public min: string;
    @Prop({ default: '23:59' })
    public max: string;
    @Prop({ default: 5 })
    public step: number;
    @Prop({ default: InputMaxWidth.Small })
    public maxWidth: string;

    public i18nButton: string = this.$i18n.translate('m-timepicker:button-ok');
    public i18nPlaceHolder: string = this.$i18n.translate('m-timepicker:placeholder');
    public i18nErrorFormat: string = this.$i18n.translate('m-timepicker:error-format');
    public i18nOutOfBoundsError: string = this.$i18n.translate('m-timepicker:out-of-bounds-error', { min: this.min, max: this.max }, undefined, undefined, undefined, FormatMode.Sprintf);

    private hours: number[] = [];
    private minutes: number[] = [];
    private internalTime: string = '';
    private internalHour: number = NaN;
    private internalMinute: number = NaN;
    private internalFilteredMinutes: number[] = [];
    private internalFilteredHours: number[] = [];
    private isMousedown: boolean = false;
    private scrollTimeout;

    private internalOpen: boolean = false;
    private internalTimeErrorMessage: string = '';
    private id: string = `mTimepicker-${uuid.generate()}`;

    private mounted(): void {
        // create hours
        for (let i: number = -1; i < MAXIMUM_HOURS; i++) {
            this.hours.push(i + 1);
        }

        // create minutes
        for (let i: number = -1; i < MAXIMUM_MINUTES; i++) {
            this.minutes.push(i + 1);
        }

        this.internalFilteredMinutes = this.minutes;
    }

    private timeStringToNumber(value: string): TimeObject {
        let timeString: string[] = value.split(':');
        let timeObject: TimeObject = {
            hour: parseInt(timeString[0], 10),
            minute: parseInt(timeString[1], 10)
        };

        return timeObject;
    }

    private validateTime(value: string): boolean {
        if (validateTimeString(value)) {
            this.internalTimeErrorMessage = '';

            if (this.validateTimeRange(value)) {
                this.internalTimeErrorMessage = '';
                return true;
            } else {
                this.internalTimeErrorMessage = this.i18nOutOfBoundsError;
                return false;
            }
        } else {
            this.internalTimeErrorMessage = this.i18nErrorFormat;
            return false;
        }
    }

    private validateTimeRange(value: string): boolean {
        return !value.length || (this.validateHour(value) && this.validateMinute(value));
    }

    private validateHour(value: string): boolean {
        return this.timeStringToNumber(value).hour >= this.timeStringToNumber(this.min).hour &&
            this.timeStringToNumber(value).hour <= this.timeStringToNumber(this.max).hour;
    }

    private validateMinute(value: string): boolean {
        if (this.timeStringToNumber(value).hour === this.timeStringToNumber(this.min).hour) {
            return this.timeStringToNumber(value).minute >= this.timeStringToNumber(this.min).minute;
        } else if (this.timeStringToNumber(value).hour === this.timeStringToNumber(this.max).hour) {
            return this.timeStringToNumber(value).minute <= this.timeStringToNumber(this.max).minute;
        } else {
            return true;
        }
    }

    private formatTimeString(): string {
        return this.formatNumber(this.internalHour) + ':' + this.formatNumber(this.internalMinute);
    }

    private formatNumber(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    private scrollToSelection(container: HTMLElement): void {
        let selectedElement: Element | null = container.querySelector('.m--is-selected');
        setTimeout(function(): void {
            if (selectedElement) {
                container.scrollTop = selectedElement['offsetTop'] - container.clientHeight / 2 + selectedElement.clientHeight / 2;
            }
        }, 10);
    }

    private positionScroll(el: Element): void {
        el.scrollTop = Math.round(el.scrollTop / 44) * 44;
    }

    ///////////////////////////////////////

    @Watch('value')
    private updateInternalTime(value: string): void {
        this.currentTime = value;
    }

    private updatePopupTime(value: string): void {
        this.internalHour = this.timeStringToNumber(value).hour;
        this.internalMinute = this.timeStringToNumber(value).minute;
    }

    private resetPopupTime(): void {
        this.internalHour = NaN;
        this.internalMinute = NaN;
    }

    ///////////////////////////////////////

    private onScroll(event: Event): void {
        if (!this.isMousedown) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {

                // tslint:disable-next-line: deprecation
                if (event.srcElement) {
                    // tslint:disable-next-line: deprecation
                    this.positionScroll(event.srcElement);
                }
            }, 300);
        }
    }

    private onSelectHour(hour: number): void {
        this.internalHour = hour;

        // change available minutes in function of min/max value
        if (hour === this.timeStringToNumber(this.min).hour) {
            this.internalFilteredMinutes = this.minutes.filter(x => (x >= this.timeStringToNumber(this.min).minute));
        } else if (hour === this.timeStringToNumber(this.max).hour) {
            this.internalFilteredMinutes = this.minutes.filter(x => (x <= this.timeStringToNumber(this.max).minute));
        } else {
            this.internalFilteredMinutes = this.minutes;
        }
    }

    private onSelectMinute(minute: number): void {
        this.internalMinute = minute;
        if (!isNaN(this.internalHour)) {
            this.currentTime = this.formatTimeString();
            this.open = false;
        }
    }

    private onMousedown(event: Event): void {
        this.isMousedown = true;
    }

    private onMouseup(event: Event): void {
        this.isMousedown = false;
        // tslint:disable-next-line: deprecation
        if (event.srcElement) {
            // tslint:disable-next-line: deprecation
            this.positionScroll(event.srcElement);
        }
    }

    private onOk(): void {
        if (!isNaN(this.internalHour) && !isNaN(this.internalMinute)) {
            this.currentTime = this.formatTimeString();
            this.open = false;
        }
    }

    private onClose(): void {
        if (isNaN(this.internalHour) || isNaN(this.internalMinute)) {
            this.resetPopupTime();
        }
    }

    ///////////////////////////////////////

    public get currentTime(): string {
        return this.internalTime;
    }

    public set currentTime(value: string) {
        let oldTime: string = this.internalTime;
        this.internalTime = value;

        if (this.validateTime(value)) {
            this.updatePopupTime(value);

            if (value !== oldTime) {
                this.$emit('input', value);
            }

        } else {
            this.resetPopupTime();
        }
    }

    public get currentHour(): number {
        return this.internalHour;
    }

    public get currentMinute(): number {
        return this.internalMinute;
    }

    public get currentfilteredHours(): number[] {
        return this.internalFilteredHours = this.hours.filter(x => (x >= this.timeStringToNumber(this.min).hour) && (x <= this.timeStringToNumber(this.max).hour));
    }

    public get currentFilteredMinutes(): number[] {
        return this.internalFilteredMinutes.filter(x => (x % this.step === 0));
    }

    public get currentStep(): number {
        return this.step * MINUTE_SECONDS;
    }

    private get timeError(): boolean {
        return this.internalTimeErrorMessage !== '' || this.as<InputState>().hasError;
    }

    private get timeErrorMessage(): string {
        return this.as<InputState>().errorMessage !== undefined ? this.as<InputState>().errorMessage : this.internalTimeErrorMessage;
    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private set open(open: boolean) {
        this.internalOpen = open;
        setTimeout(() => {
            if (this.internalOpen) {
                this.scrollToSelection(this.$refs.hours as HTMLElement);
                this.scrollToSelection(this.$refs.minutes as HTMLElement);
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    private get ariaControls(): string {
        return this.id + '-controls';
    }
}

const TimepickerPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStylePlugin);
        v.use(ButtonPlugin);
        v.use(PopupPlugin);
        v.use(ValidationMessagePlugin);
        v.use(MediaQueriesPlugin);
        v.component(TIMEPICKER_NAME, MTimepicker);
    }
};

export default TimepickerPlugin;
