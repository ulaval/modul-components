import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';

export const STATE_SUCCESS: string = 'success';
export const STATE_INFORMATION: string = 'information';
export const STATE_WARNING: string = 'warning';
export const STATE_ERROR: string = 'error';

export const MODE_REGULAR: string = 'regular';
export const MODE_LIGHT: string = 'light';

@WithRender
@Component
export class MSpinner extends Vue {
    @Prop({ default: STATE_SUCCESS })
    public state: string;
    @Prop({ default: MODE_REGULAR })
    public mode: string;
    @Prop({ default: true })
    public icon: boolean;
    @Prop({ default: false })
    public closeButton: boolean;
    @Prop({ default: true })
    public visible: boolean;

    public componentName = SPINNER_NAME;

    private get showCloseButton(): boolean {
        return this.mode == MODE_REGULAR && this.closeButton;
    }

    private onClose(event): void {
        this.$emit('close', event);
        this.visible = false;
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case STATE_SUCCESS:
                icon = 'chip-check';
                break;
            case STATE_INFORMATION:
                icon = 'default';
                break;
            case STATE_WARNING:
                icon = 'chip-warning';
                break;
            case STATE_ERROR:
                icon = 'chip-error';
                break;
            default:
                break;
        }
        return icon;
    }

}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
