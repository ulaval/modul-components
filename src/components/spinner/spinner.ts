import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';
import PortalPlugin from 'portal-vue';
import ModulPlugin from '../../utils/modul/modul';

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
    @Prop()
    public title: string;

    @Prop()
    public description: string;

    @Prop({
        default: MSpinnerStyle.Regular,
        validator: value =>
            value == MSpinnerStyle.Dark ||
            value == MSpinnerStyle.Light ||
            value == MSpinnerStyle.Lighter ||
            value == MSpinnerStyle.Regular
    })
    public skin: MSpinnerStyle;

    @Prop({
        default: MSpinnerSize.Large,
        validator: value =>
            value == MSpinnerSize.Large ||
            value == MSpinnerSize.Small
    })
    public size: MSpinnerSize;

    @Prop()
    public modal: boolean;

    private spinnerId: string = SPINNER_ID + '-' + uuid.generate();
    private portalTargetEl: HTMLElement | undefined = undefined;

    private visible: boolean = false;

    protected beforeDestroy(): void {
        if (this.modal) {
            let el: HTMLElement = document.getElementById(this.spinnerId) as HTMLElement;
            if (el) {
                document.body.removeChild(el);
            }
        }
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasDescription(): boolean {
        return !!this.description;
    }

    private onBeforeEnter(): void {
        let el: HTMLElement = document.getElementById(this.spinnerId) as HTMLElement;
        if (this.modal && !el) {
            let element: HTMLElement = document.createElement('div');
            element.setAttribute('id', this.spinnerId);
            document.body.appendChild(element);
        }
    }

    private onEnter(): void {
        if (!this.portalTargetEl && this.modal) {
            this.portalTargetEl = document.getElementById(this.spinnerId) as HTMLElement;
            this.$modul.pushElement(this.portalTargetEl, true, false);
            this.portalTargetEl.style.position = 'absolute';
        }
        this.visible = true;
    }

    private onLeave(): void {
        this.visible = false;
        if (this.modal && this.portalTargetEl) {
            this.$modul.popElement(this.portalTargetEl, true, false);
            this.portalTargetEl.style.position = '';
            this.portalTargetEl = undefined;
        }
    }
}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(PortalPlugin);
        v.use(ModulPlugin);
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
