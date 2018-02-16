import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon-file.html?style=./icon-file.scss';
import { ICON_FILE_NAME, ICON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';

export enum MIconFileState {
    Completed = 'completed',
    Warning = 'warning',
    Error = 'error'
}

@WithRender
@Component
export class MIconFile extends Vue {

    @Prop()
    public name: string;
    @Prop({ default: '30px' })
    public size: string;
    @Prop({ default: '16px' })
    public chipSize: string;
    @Prop()
    public svgTitle: string;
    @Prop({
        validator: value =>
            value == MIconFileState.Completed ||
            value == MIconFileState.Warning ||
            value == MIconFileState.Error
    })
    public state: MIconFileState;

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MIconFileState.Completed:
                icon = 'chip-check';
                break;
            case MIconFileState.Warning:
                icon = 'chip-warning';
                break;
            case MIconFileState.Error:
                icon = 'chip-error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get rightDistance(): string {
        let size = parseInt(this.size, 10);
        let chipSise = parseInt(this.chipSize, 10);
        let realSize = (size / (24 / 18));
        let distance = ((size - realSize) / 2) - (chipSise / 2);
        return distance + 'px';
    }

    private get bottomDistance(): string {
        let chipSise = parseInt(this.chipSize, 10);
        let distance = chipSise * (1 / 4);
        return '-' + distance + 'px';
    }

}

const IconFilePlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(ICON_FILE_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(ICON_FILE_NAME, MIconFile);
    }
};

export default IconFilePlugin;
