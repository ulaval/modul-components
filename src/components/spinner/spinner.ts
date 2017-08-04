import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';

export enum MSpinnerMode {
    Loading = 'loading',
    Processing = 'processing'
}

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

const SPINNER_ID: string = 'MSpinner';

@WithRender
@Component
export class MSpinner extends ModulVue {
    @Prop({ default: MSpinnerMode.Loading })
    public mode: MSpinnerMode;
    @Prop()
    public title: string;
    @Prop()
    public description: string;
    @Prop()
    public aspect: MSpinnerStyle;
    @Prop({ default: MSpinnerSize.Large })
    public size: MSpinnerSize;

    public componentName = SPINNER_NAME;

    private spinnerId: string = SPINNER_ID + '-' + uuid.generate();
    private spinnerPortalId: string = SPINNER_ID + '-portal-' + uuid.generate();

    private bodyElement: HTMLElement = document.body;
    private portalTargetElement: HTMLElement = document.createElement('div');
    private defaultTargetElVisible: boolean = false;
    private spinnerVisible: boolean = false;
    private internalPropMode: MSpinnerMode;

    protected beforeMount(): void {
        this.propMode = this.mode;
    }

    protected destroyed(): void {
        if (this.internalPropMode == MSpinnerMode.Processing) {
            this.removeSpinnerToBody();
        }
    }

    @Watch('mode')
    private modeChanged(value: MSpinnerMode): void {
        this.propMode = this.mode;
    }

    private get propMode(): MSpinnerMode {
        return this.internalPropMode;
    }

    private set propMode(value: MSpinnerMode) {
        if (this.internalPropMode != value) {
            this.internalPropMode = value;

            if (this.internalPropMode == MSpinnerMode.Processing) {
                this.defaultTargetElVisible = false;
                this.spinnerVisible = false;
                Vue.nextTick(() => {
                    this.appendSpinnerToBody();
                });
            } else {
                this.removeSpinnerToBody();
                this.defaultTargetElVisible = true;
                this.spinnerVisible = true;
            }
        }
    }

    private appendSpinnerToBody(): void {
        this.portalTargetElement.setAttribute('id', this.spinnerPortalId);
        this.portalTargetElement.setAttribute('class', 'm-spinner-popover');
        this.portalTargetElement.style.position = 'relative';
        this.bodyElement.appendChild(this.portalTargetElement);

        this.$mWindow.addWindow(this.spinnerPortalId);
        this.portalTargetElement.style.zIndex = String(this.$mWindow.windowZIndex);

        if (!this.$mWindow.hasBackdrop) {
            this.$mWindow.createBackdrop(this.bodyElement);
        }

        this.bodyElement.appendChild(this.portalTargetElement);
        this.spinnerVisible = true;
    }

    private removeSpinnerToBody(): void {
        let portalTargetElement: HTMLElement = this.bodyElement.querySelector('#' + this.spinnerPortalId) as HTMLElement;
        if (portalTargetElement) {
            this.bodyElement.removeChild(portalTargetElement);
            this.$mWindow.deleteWindow(this.spinnerPortalId);
        }
    }

    private getSpinnerId(): string {
        return this.mode == MSpinnerMode.Processing ? this.spinnerPortalId : this.spinnerId;
    }

    private get propAspect(): MSpinnerStyle {
        let result: MSpinnerStyle;
        switch (this.aspect) {
            case MSpinnerStyle.Dark:
            case MSpinnerStyle.Light:
            case MSpinnerStyle.Lighter:
            case MSpinnerStyle.Regular:
                result = this.aspect;
                break;
            default:
                result = this.mode == MSpinnerMode.Processing ? MSpinnerStyle.Light : MSpinnerStyle.Regular;
                break;
        }
        return result;
    }

    private get propSize(): string {
        return this.size == MSpinnerSize.Small ? MSpinnerSize.Small : MSpinnerSize.Large;
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasDescription(): boolean {
        return !!this.description;
    }
}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
