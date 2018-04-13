import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon-file.html';
import { ICON_FILE_NAME } from '../component-names';

// PDF
export const TYPE_PDF: string = 'pdf';
// DOC
export const TYPE_DOC: string = 'doc';
export const TYPE_DOCX: string = 'docx';
// TEXT
export const TYPE_TXT: string = 'txt';
export const TYPE_CSV: string = 'csv';
// IMAGE
export const TYPE_BMP: string = 'bmp';
export const TYPE_EPS: string = 'eps';
export const TYPE_GIF: string = 'gif';
export const TYPE_JPEG: string = 'jpeg';
export const TYPE_JPG: string = 'jpg';
export const TYPE_PNG: string = 'png';
export const TYPE_TIF: string = 'tif';
export const TYPE_TIFF: string = 'tiff';
export const TYPE_PSD: string = 'psd';
export const TYPE_AI: string = 'ai';
export const TYPE_INDD: string = 'indd';
// VIDEO
export const TYPE_MPEG: string = 'mpeg';
export const TYPE_MP4: string = 'mp4';
export const TYPE_AVI: string = 'avi';
// ARCHIVE
export const TYPE_ZIP: string = 'zip';
export const TYPE_RAR: string = 'rar';
export const TYPE_TAR: string = 'tar';
export const TYPE_GTAR: string = 'gtar';
export const TYPE_GZ: string = 'gz';

// EXTENSIONS GROUPS
export const GROUP_PDF: string = 'modulsvg-file-pdf';
export const GROUP_DOC: string = 'modulsvg-file-other';
export const GROUP_TEXT: string = 'modulsvg-file-other';
export const GROUP_IMAGE: string = 'modulsvg-file-other';
export const GROUP_VIDEO: string = 'modulsvg-file-other';
export const GROUP_ARCHIVE: string = 'modulsvg-file-other';

export type FileGroup = {
    [key: string]: string
};

const FILES_ASSOCIATIONS: FileGroup = {
    [TYPE_PDF]: GROUP_PDF,
    [TYPE_DOC]: GROUP_DOC,
    [TYPE_DOCX]: GROUP_DOC,
    [TYPE_TXT]: GROUP_TEXT,
    [TYPE_CSV]: GROUP_TEXT,
    [TYPE_BMP]: GROUP_IMAGE,
    [TYPE_EPS]: GROUP_IMAGE,
    [TYPE_GIF]: GROUP_IMAGE,
    [TYPE_JPEG]: GROUP_IMAGE,
    [TYPE_JPG]: GROUP_IMAGE,
    [TYPE_PNG]: GROUP_IMAGE,
    [TYPE_TIF]: GROUP_IMAGE,
    [TYPE_TIFF]: GROUP_IMAGE,
    [TYPE_PSD]: GROUP_IMAGE,
    [TYPE_AI]: GROUP_IMAGE,
    [TYPE_INDD]: GROUP_IMAGE,
    [TYPE_MPEG]: GROUP_VIDEO,
    [TYPE_MP4]: GROUP_VIDEO,
    [TYPE_AVI]: GROUP_VIDEO,
    [TYPE_ZIP]: GROUP_ARCHIVE,
    [TYPE_RAR]: GROUP_ARCHIVE,
    [TYPE_TAR]: GROUP_ARCHIVE,
    [TYPE_GTAR]: GROUP_ARCHIVE,
    [TYPE_GZ]: GROUP_ARCHIVE
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

    protected beforeMount(): void {
        if (!this.extension) {
            console.error('You must have an extension attribute');
        }
    }

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
            case TYPE_DOCX:
                id = FILES_ASSOCIATIONS[TYPE_DOCX];
                break;
            case TYPE_TXT:
                id = FILES_ASSOCIATIONS[TYPE_TXT];
                break;
            case TYPE_CSV:
                id = FILES_ASSOCIATIONS[TYPE_CSV];
                break;
            case TYPE_BMP:
                id = FILES_ASSOCIATIONS[TYPE_BMP];
                break;
            case TYPE_EPS:
                id = FILES_ASSOCIATIONS[TYPE_EPS];
                break;
            case TYPE_GIF:
                id = FILES_ASSOCIATIONS[TYPE_GIF];
                break;
            case TYPE_JPEG:
                id = FILES_ASSOCIATIONS[TYPE_JPEG];
                break;
            case TYPE_JPG:
                id = FILES_ASSOCIATIONS[TYPE_JPG];
                break;
            case TYPE_PNG:
                id = FILES_ASSOCIATIONS[TYPE_PNG];
                break;
            case TYPE_TIF:
                id = FILES_ASSOCIATIONS[TYPE_TIF];
                break;
            case TYPE_TIFF:
                id = FILES_ASSOCIATIONS[TYPE_TIFF];
                break;
            case TYPE_PSD:
                id = FILES_ASSOCIATIONS[TYPE_PSD];
                break;
            case TYPE_AI:
                id = FILES_ASSOCIATIONS[TYPE_AI];
                break;
            case TYPE_INDD:
                id = FILES_ASSOCIATIONS[TYPE_INDD];
                break;
            case TYPE_MPEG:
                id = FILES_ASSOCIATIONS[TYPE_MPEG];
                break;
            case TYPE_MP4:
                id = FILES_ASSOCIATIONS[TYPE_MP4];
                break;
            case TYPE_AVI:
                id = FILES_ASSOCIATIONS[TYPE_AVI];
                break;
            case TYPE_ZIP:
                id = FILES_ASSOCIATIONS[TYPE_ZIP];
                break;
            case TYPE_RAR:
                id = FILES_ASSOCIATIONS[TYPE_RAR];
                break;
            case TYPE_TAR:
                id = FILES_ASSOCIATIONS[TYPE_TAR];
                break;
            case TYPE_GTAR:
                id = FILES_ASSOCIATIONS[TYPE_GTAR];
                break;
            case TYPE_GZ:
                id = FILES_ASSOCIATIONS[TYPE_GZ];
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
