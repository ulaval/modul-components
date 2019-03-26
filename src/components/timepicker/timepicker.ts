import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
import { InputMaxWidth, InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
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

    @Prop()
    public label: string;
    @Prop({ default: '00:00' })
    public min: string;
    @Prop({ default: '23:59' })
    public max: string;
    @Prop({ default: 5 })
    public step: number;
    @Prop({ default: InputMaxWidth.Small })
    public maxWidth: string;

    public i18nButton: string = this.$i18n.translate('m-timepicker:button-ok');

    private hours: number[] = [];
    private minutes: number[] = [];
    private internalTime: string = '';
    private internalHour: number = NaN;
    private internalMinute: number = NaN;
    private isMousedown: boolean = false;
    private scrollTimeout;

    private internalOpen: boolean = false;
    private internalTimeErrorMessage: string = '';
    private id: string = `mTimepicker-${uuid.generate()}`;

    private mounted(): void {
        // create hours
        for (let i: number = 0; i < 24; i++) {
            this.hours.push(i + 1);
        }

        // create minutes
        for (let i: number = 0; i < 59; i++) {
            this.minutes.push(i + 1);
        }

        // affect inital model
        if (this.as<InputManagement>().value) {
            this.initTime();
        }
    }

    private initTime(): void {
        this.internalTime = this.as<InputManagement>().value;
        this.dispatchTime(this.as<InputManagement>().value);
    }

    private dispatchTime(value: string): void {
        let time: string[] = value.split(':');
        this.internalHour = parseInt(time[0], 10);
        this.internalMinute = parseInt(time[1], 10);
    }

    private selectHour(hour: number): void {
        this.internalHour = hour;
    }

    private selectMinute(minute: number): void {
        this.internalMinute = minute;
        this.emitTime();
        this.open = false;
    }

    private emitTime(): void {
        this.internalTime = this.formatTime();
        this.$emit('input', this.internalTime);
    }

    private formatTime(): string {
        return this.formatNumber(this.internalHour) + ':' + this.formatNumber(this.internalMinute);
    }

    private formatNumber(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    public get currentTime(): string {
        return this.internalTime;
    }

    public set currentTime(value: string) {
        this.internalTime = value;
        this.dispatchTime(value);
        this.$emit('input', value);
    }

    public get currentHour(): number {
        return this.internalHour;
    }

    public get currentMinute(): number {
        return this.internalMinute;
    }

    private get currentStep(): number {
        return this.step * 60;
    }

    private get filteredMinutes(): number[] {
        return this.minutes.filter(x => x % this.step === 0);
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
                // let inputEl: any = this.$refs.input;
                // inputEl.focus();
                // inputEl.setSelectionRange(0, this.formattedTime.length);
                // this.scrollToSelection(this.$refs.hours as HTMLElement);
                // this.scrollToSelection(this.$refs.minutes as HTMLElement);
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    private scrollToSelection(container: HTMLElement): void {
        let selectedElement: Element | null = container.querySelector('.m--is-selected');
        setTimeout(function(): void {
            if (selectedElement) {
                container.scrollTop = selectedElement['offsetTop'] - container.clientHeight / 2 + selectedElement.clientHeight / 2;
            }
        }, 10);
    }

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
        this.emitTime();
        this.open = false;
    }

    private positionScroll(el: Element): void {
        el.scrollTop = Math.round(el.scrollTop / 44) * 44;
    }

    private get ariaControls(): string {
        return this.id + '-controls';
    }
}

const TimepickerPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MTimepicker will be deprecated in modul v.1.0');

        v.use(InputStylePlugin);
        v.use(ButtonPlugin);
        v.use(PopupPlugin);
        v.use(ValidationMessagePlugin);
        v.use(MediaQueriesPlugin);
        v.component(TIMEPICKER_NAME, MTimepicker);
    }
};

export default TimepickerPlugin;
