import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon-file.html';
import { ICON_FILE_NAME } from '../component-names';

export const TYPE_PDF: string[] = ['pdf'];
export const TYPE_DOC: string[] = ['doc', 'txt'];
export const TYPE_VIDEO: string[] = ['mp4'];
export const TYPE_IMG: string[] = ['img'];
export const TYPE_ARCHIVE: string[] = ['zip'];

@WithRender
@Component
export class MIconFile extends Vue {
    @Prop()
    public extension: string;
    @Prop()
    public svgTitle: string;
    @Prop({ default: '24px' })
    public size: string;

    private get hasSvgTitle(): boolean {
        return !!this.svgTitle;
    }

    private get spriteId(): string {
        let cleanExtension = this.extension.split('.').join('').toLowerCase();
        let id: string = '';
        switch (cleanExtension) {
            case this.checkExtension(cleanExtension, TYPE_PDF):
                id = 'modulsvg-file-pdf';
                break;
            case this.checkExtension(cleanExtension, TYPE_DOC):
                id = 'information';
                break;
            case this.checkExtension(cleanExtension, TYPE_VIDEO):
                id = 'warning';
                break;
            case this.checkExtension(cleanExtension, TYPE_IMG):
                id = 'error';
                break;
            case this.checkExtension(cleanExtension, TYPE_ARCHIVE):
                id = 'options';
                break;
            default:
                id = 'modulsvg-file-other';
                break;
        }
        return id;
    }

    private checkExtension(ext: string, type: string[]): string {
        return type.indexOf(ext) > -1 ? ext : '';
    }

    private onClick(event): void {
        this.$emit('click', event);
    }

    private onKeydown(event): void {
        this.$emit('keydown', event);
    }
}

const IconFilePlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(ICON_FILE_NAME, 'plugin.install');
        v.component(ICON_FILE_NAME, MIconFile);
    }
};

export default IconFilePlugin;
