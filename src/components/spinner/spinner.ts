import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';

export const MODE_LOADING: string = 'loading';
export const MODE_PROCESSING: string = 'processing';

export const ASPECT_DEFAULT: string = 'default';
export const ASPECT_LIGHT: string = 'light';
export const ASPECT_DARK: string = 'dark';

export const SIZE_LARGE: string = 'large';
export const SIZE_SMALL: string = 'small';

export const SPINNER_ID: string = 'MSpinner';

@WithRender
@Component
export class MSpinner extends ModulVue {
    @Prop({ default: MODE_LOADING })
    public mode: string;
    @Prop()
    public title: string;
    @Prop()
    public description: string;
    @Prop()
    public aspect: string;
    @Prop({ default: SIZE_LARGE } )
    public size: string;

    public componentName = SPINNER_NAME;

    private spinnerId: string = SPINNER_ID;
    private bodyElement: HTMLElement = document.body;
    private portalTargetElement: HTMLElement = document.createElement('div');
    private defaultTagetElVisible: boolean = false;
    private spinnerVisible: boolean = false;

    private mounted(): void {
        this.spinnerId = SPINNER_ID + '-' + uuid.generate();
        if (this.mode == MODE_PROCESSING) {
            this.appendSpinnerToBody();
        } else {
            this.defaultTagetElVisible = true;
            this.spinnerVisible = true;
        }
    }

    private destroyed(): void {
        if (this.mode == MODE_PROCESSING) {
            this.removeSpinnerToBody();
        }
    }

    private appendSpinnerToBody(): void {
        this.portalTargetElement.setAttribute('id', this.spinnerId);
        this.portalTargetElement.setAttribute('class', 'm-spinner-popover');
        this.portalTargetElement.style.position = 'relative';
        this.bodyElement.appendChild(this.portalTargetElement);

        this.$mWindow.addWindow(this.spinnerId);
        this.portalTargetElement.style.zIndex = String(this.$mWindow.windowZIndex);

        if (!this.$mWindow.hasBackdrop) {
            this.$mWindow.createBackdrop(this.bodyElement);
        }

        this.bodyElement.appendChild(this.portalTargetElement);
        this.spinnerVisible = true;
    }

    private removeSpinnerToBody(): void {
        let portalTargetElement: HTMLElement = this.bodyElement.querySelector('#' + this.spinnerId) as HTMLElement;
        if (portalTargetElement) {
            this.bodyElement.removeChild(portalTargetElement);
            this.$mWindow.deleteWindow(this.spinnerId);
        }
    }

    private get propAspect(): string {
        if ((this.aspect != ASPECT_DARK || this.aspect != ASPECT_DEFAULT) && this.mode == MODE_PROCESSING) {
            return ASPECT_LIGHT;
        } else {
            return this.aspect == ASPECT_LIGHT || this.aspect == ASPECT_DARK ? this.aspect : ASPECT_DEFAULT;
        }
    }

    private get propSize(): string {
        return this.size == SIZE_SMALL ? SIZE_SMALL : SIZE_LARGE;
    }

    private get hasTitle(): boolean {
        return this.title == '' || this.title == undefined ? false : true;
    }

    private get hasDescription(): boolean {
        return this.description == '' || this.description == undefined ? false : true;
    }
}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
