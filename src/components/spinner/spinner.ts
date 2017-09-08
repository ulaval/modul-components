import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';
import { Portal, PortalMixin } from '../../mixins/portal/portal';

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
@Component({
    mixins: [Portal]
})
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
    private spinnerPortalId: string;

    private defaultTargetElVisible: boolean = false;
    private visible: boolean = false;
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
                this.visible = false;
                this.$nextTick(() => {
                    this.appendSpinnerToBody();
                });
            } else {
                this.removeSpinnerToBody();
                this.defaultTargetElVisible = true;
                this.visible = true;
            }
        }
    }

    private appendSpinnerToBody(): void {
        this.as<PortalMixin>().appendBackdropAndPortalToBody(SPINNER_ID, 'm-spinner-popover', '0.3s');
        this.spinnerPortalId = this.as<PortalMixin>().portalId;

        this.visible = true;
    }

    private removeSpinnerToBody(): void {
        this.as<PortalMixin>().removeBackdropAndPortal();
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
