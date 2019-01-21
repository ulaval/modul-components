import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { BackdropMode } from '../../mixins/portal/portal';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SPINNER_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import WithRender from './spinner.html?style=./spinner.scss';



export enum MSpinnerStyle {
    Dark = 'dark',
    Regular = 'regular',
    Light = 'light',
    Lighter = 'lighter'
}

export enum MSpinnerSize {
    Large = 'large',
    Small = 'small'
}

export const PROCESSING_WARN: string = 'Change of property "processing" is not supported';
const SPINNER_ID: string = 'MSpinner';

@WithRender
@Component
export class MSpinner extends ModulVue {
    @Prop()
    public title: boolean;

    @Prop()
    public titleMessage: string;

    @Prop()
    public description: boolean;

    @Prop()
    public descriptionMessage: string;

    @Prop({
        default: MSpinnerStyle.Regular,
        validator: value =>
            value === MSpinnerStyle.Dark ||
            value === MSpinnerStyle.Light ||
            value === MSpinnerStyle.Lighter ||
            value === MSpinnerStyle.Regular
    })
    public skin: MSpinnerStyle;

    @Prop({
        default: MSpinnerSize.Large,
        validator: value =>
            value === MSpinnerSize.Large ||
            value === MSpinnerSize.Small
    })
    public size: MSpinnerSize;

    @Prop()
    public processing: boolean;

    private spinnerId: string = SPINNER_ID + '-' + uuid.generate();
    private portalTargetEl: HTMLElement | undefined = {} as HTMLElement; // initialized to be responsive

    private initialized: boolean = false; // seems to be necessary since $refs are not responsive
    private visible: boolean = false;
    private stackId: string;

    protected created(): void {
        this.portalTargetEl = undefined;
    }

    protected beforeDestroy(): void {
        if (this.processing) {
            let el: HTMLElement = document.getElementById(this.spinnerId) as HTMLElement;
            if (el) {
                document.body.removeChild(el);
            }
        }
    }

    @Watch('processing')
    private onProcessingChange(value: boolean): void {
        this.$log.warn(`<${SPINNER_NAME}>: ${PROCESSING_WARN}`);
        if (!value) {
            this.removeBackdrop();
        }
    }

    private get spinnerElement(): HTMLElement | undefined {
        return this.processing ? this.portalTargetEl : this.$refs.spinnerContainer as HTMLElement;
    }

    private onEnter(): void {
        if (!this.portalTargetEl && this.processing) {
            let element: HTMLElement = document.createElement('div');
            element.setAttribute('id', this.spinnerId);
            document.body.appendChild(element);
            this.portalTargetEl = document.getElementById(this.spinnerId) as HTMLElement;
            this.stackId = this.$modul.pushElement(this.portalTargetEl, BackdropMode.BackdropSlow, false);
            this.portalTargetEl.style.position = 'absolute';
        }
        this.initialized = true;
        this.visible = true;
    }

    private onLeave(): void {
        this.visible = false;
        if (this.processing) {
            this.removeBackdrop();
        }
    }

    private removeBackdrop(): void {
        if (this.portalTargetEl) {
            this.$modul.popElement(this.stackId);
            this.portalTargetEl.style.position = '';
            this.portalTargetEl = undefined;
        }
    }

    private get hasTitleMessage(): boolean {
        return this.titleMessage !== '' && this.titleMessage !== undefined;
    }

    private get hasDescriptionMessage(): boolean {
        return this.descriptionMessage !== '' && this.descriptionMessage !== undefined;
    }

    private get hasTitle(): boolean {
        return this.title || this.hasTitleMessage;
    }

    private get hasDescription(): boolean {
        return this.description || this.hasDescriptionMessage;
    }
}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
