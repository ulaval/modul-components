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
// MUSIC
export const TYPE_MP3: string = 'mp3';
export const TYPE_OGG: string = 'ogg';
export const TYPE_WAV: string = 'wav';
export const TYPE_AIFF: string = 'aiff';
export const TYPE_AAC: string = 'aac';
export const TYPE_RA: string = 'ra';
// ARCHIVE
export const TYPE_ZIP: string = 'zip';
export const TYPE_RAR: string = 'rar';
export const TYPE_TAR: string = 'tar';
export const TYPE_GTAR: string = 'gtar';
export const TYPE_GZ: string = 'gz';

// EXTENSIONS GROUPS
export const GROUP_PDF: string = 'm-svg__file-pdf';
export const GROUP_DOC: string = 'm-svg__file-doc';
export const GROUP_TEXT: string = 'm-svg__file-text';
export const GROUP_IMAGE: string = 'm-svg__file-image';
export const GROUP_VIDEO: string = 'm-svg__file-video';
export const GROUP_MUSIC: string = 'm-svg__file-music';
export const GROUP_ARCHIVE: string = 'm-svg__file-archive';
export const GROUP_OTHER: string = 'm-svg__file-other';

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
    [TYPE_MP3]: GROUP_MUSIC,
    [TYPE_OGG]: GROUP_MUSIC,
    [TYPE_WAV]: GROUP_MUSIC,
    [TYPE_AIFF]: GROUP_MUSIC,
    [TYPE_AAC]: GROUP_MUSIC,
    [TYPE_RA]: GROUP_MUSIC,
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
            console.error('You must have an extension attribute with the icon-file component');
        }
    }

    private get spriteId(): string {
        let cleanExtension;
        if (this.extension) {
            cleanExtension = this.extension.split('.').join('').toLowerCase();
        }
        return FILES_ASSOCIATIONS[cleanExtension] || GROUP_OTHER;
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
