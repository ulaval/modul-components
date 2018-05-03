import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ICON_FILE_NAME } from '../component-names';
import IconPluggin from '../icon/icon';
import WithRender from './icon-file.html';

// PDF
const EXT_PDF: string = 'pdf';
// DOC
const EXT_DOC: string = 'doc,docx';
// TEXT
const EXT_TEXT: string = 'txt,csv';
// IMAGE
const EXT_IMAGE: string = 'bmp,eps,gif,jpeg,jpg,png,tif,tiff,psd,ai,indd';
// VIDEO
const EXT_VIDEO: string = 'mpeg,mp4,avi';
// MUSIC
const EXT_MUSIC: string = 'mp3,ogg,wav,aiff,aac,ra';
// ARCHIVE
const EXT_ARCHIVE: string = 'zip,rar,tar,gtar,gz';

// EXTENSIONS GROUPS
const GROUP_PDF: string = 'm-svg__file-pdf';
const GROUP_DOC: string = 'm-svg__file-doc';
const GROUP_TEXT: string = 'm-svg__file-text';
const GROUP_IMAGE: string = 'm-svg__file-image';
const GROUP_VIDEO: string = 'm-svg__file-video';
const GROUP_MUSIC: string = 'm-svg__file-music';
const GROUP_ARCHIVE: string = 'm-svg__file-archive';
const GROUP_OTHER: string = 'm-svg__file-other';

type FileGroup = {
    [key: string]: string
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

    private fileMap: FileGroup = {};

    public get spriteId(): string {
        let cleanExtension: string = this.extension ? this.extension.replace('.', '').toLowerCase() : '';
        return this.fileMap[cleanExtension] || GROUP_OTHER;
    }

    protected beforeMount(): void {
        this.mapExtensionsGroup(EXT_PDF, GROUP_PDF);
        this.mapExtensionsGroup(EXT_DOC, GROUP_DOC);
        this.mapExtensionsGroup(EXT_TEXT, GROUP_TEXT);
        this.mapExtensionsGroup(EXT_IMAGE, GROUP_IMAGE);
        this.mapExtensionsGroup(EXT_VIDEO, GROUP_VIDEO);
        this.mapExtensionsGroup(EXT_MUSIC, GROUP_MUSIC);
        this.mapExtensionsGroup(EXT_ARCHIVE, GROUP_ARCHIVE);
    }

    private mapExtensionsGroup(extensions, category: string): void {
        extensions.split(',').forEach(ex => this.fileMap[ex] = category);
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
        v.prototype.$log.debug(ICON_FILE_NAME, 'plugin.install');
        v.use(IconPluggin);
        v.component(ICON_FILE_NAME, MIconFile);
    }
};

export default IconFilePlugin;
