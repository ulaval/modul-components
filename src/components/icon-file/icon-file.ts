import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon-file.html';
import { ICON_FILE_NAME } from '../component-names';

// Extensions list
export const TYPE_PDF: string = 'pdf';
export const TYPE_DOC: string = 'doc';
export const TYPE_TXT: string = 'txt';
export const TYPE_MP4: string = 'mp4';
export const TYPE_IMG: string = 'img';
export const TYPE_GIF: string = 'gif';
export const TYPE_ZIP: string = 'zip';

// Extensions group
export const GROUP_PDF: string = 'modulsvg-file-pdf';
export const GROUP_DOC: string = 'modulsvg-file-other';
export const GROUP_VIDEO: string = 'modulsvg-file-other';
export const GROUP_IMAGE: string = 'modulsvg-file-other';
export const GROUP_ARCHIVE: string = 'modulsvg-file-other';

export type FileGroup = {
    [key: string]: string
};

const FILES_ASSOCIATIONS: FileGroup = {
    [TYPE_PDF]: GROUP_PDF,
    [TYPE_DOC]: GROUP_DOC,
    [TYPE_TXT]: GROUP_DOC,
    [TYPE_MP4]: GROUP_VIDEO,
    [TYPE_IMG]: GROUP_IMAGE,
    [TYPE_GIF]: GROUP_IMAGE,
    [TYPE_ZIP]: GROUP_ARCHIVE
};

@WithRender
@Component
export class MIconFile extends Vue {
    @Prop()
    public extension: string;
    @Prop()
    public svgTitle: string;
    @Prop({ default: '24px' })
    public size: string;

    private get spriteId(): string {
        let cleanExtension = this.extension.split('.').join('').toLowerCase();
        let id: string = '';
        switch (cleanExtension) {
            case TYPE_PDF:
                id = FILES_ASSOCIATIONS[TYPE_PDF];
                break;
            case TYPE_DOC:
                id = FILES_ASSOCIATIONS[TYPE_DOC];
                break;
            case TYPE_TXT:
                id = FILES_ASSOCIATIONS[TYPE_TXT];
                break;
            case TYPE_MP4:
                id = FILES_ASSOCIATIONS[TYPE_MP4];
                break;
            case TYPE_IMG:
                id = FILES_ASSOCIATIONS[TYPE_IMG];
                break;
            case TYPE_GIF:
                id = FILES_ASSOCIATIONS[TYPE_GIF];
                break;
            case TYPE_ZIP:
                id = FILES_ASSOCIATIONS[TYPE_ZIP];
                break;
            default:
                id = 'modulsvg-file-other';
                break;
        }
        return id;
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
