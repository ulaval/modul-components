import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ICON_FILE_NAME } from '../component-names';
import IconPluggin from '../icon/icon';
import WithRender from './icon-file.html';

// Extension list
const EXT_IMAGE: string = 'bmp,eps,gif,jpeg,jpg,png,tif,tiff,psd,ai,indd';
const EXT_TEXT: string = 'txt,csv';
const EXT_DOC: string = 'doc,docx';
const EXT_VSD: string = 'vsd,vsdx';
const EXT_PPT: string = 'ppt,pptx,pps,ppsx';
const EXT_XLS: string = 'xls,xlsx,xlt,xlv,xlw';
const EXT_ACCDB: string = 'mdb,accdb';
const EXT_PDF: string = 'pdf';
const EXT_RM: string = 'rm';
const EXT_MOV: string = 'mov';
const EXT_WMA: string = 'wma,wmv,asf';
const EXT_SWF: string = 'swf,flv,fla';
const EXT_VIDEO: string = 'mpeg,mp4,avi';
const EXT_MUSIC: string = 'mp3,ogg,wav,aiff,aac,ra';
const EXT_ARCHIVE: string = 'zip,rar,tar,gtar,gz';
const EXT_OPEN_OFFICE: string = 'sxw,sxi,sxd,sxc,sxm,sxg';
const EXT_ODT: string = 'odt';
const EXT_ODP: string = 'odp';
const EXT_ODG: string = 'odg';
const EXT_ODS: string = 'ods';
const EXT_ODF: string = 'odf';
const EXT_ODB: string = 'odb';
const EXT_DWG: string = 'dwg,dao,cao,dxf,dwf';

// EXTENSIONS GROUPS
const GROUP_IMAGE: string = 'm-svg__file-image';
const GROUP_TEXT: string = 'm-svg__file-text';
const GROUP_DOC: string = 'm-svg__file-word';
const GROUP_VSD: string = 'm-svg__file-visio';
const GROUP_PPT: string = 'm-svg__file-powerpoint';
const GROUP_XLS: string = 'm-svg__file-excel';
const GROUP_ACCDB: string = 'm-svg__file-access';
const GROUP_PDF: string = 'm-svg__file-pdf';
const GROUP_RM: string = 'm-svg__file-realplayer';
const GROUP_MOV: string = 'm-svg__file-quicktime';
const GROUP_WMA: string = 'm-svg__file-mediaplayer';
const GROUP_SWF: string = 'm-svg__file-flash';
const GROUP_VIDEO: string = 'm-svg__file-video';
const GROUP_MUSIC: string = 'm-svg__file-music';
const GROUP_ARCHIVE: string = 'm-svg__file-zip';
const GROUP_OPEN_OFFICE: string = 'm-svg__file-openoffice-default';
const GROUP_ODT: string = 'm-svg__file-openoffice-writter';
const GROUP_ODP: string = 'm-svg__file-openoffice-impress';
const GROUP_ODG: string = 'm-svg__file-openoffice-draw';
const GROUP_ODS: string = 'm-svg__file-openoffice-calc';
const GROUP_ODF: string = 'm-svg__file-openoffice-math';
const GROUP_ODB: string = 'm-svg__file-openoffice-base';
const GROUP_DWG: string = 'm-svg__file-dwg';
const GROUP_OTHER: string = 'm-svg__file-default';

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
        this.mapExtensionsGroup(EXT_IMAGE, GROUP_IMAGE);
        this.mapExtensionsGroup(EXT_TEXT, GROUP_TEXT);
        this.mapExtensionsGroup(EXT_DOC, GROUP_DOC);
        this.mapExtensionsGroup(EXT_VSD, GROUP_VSD);
        this.mapExtensionsGroup(EXT_PPT, GROUP_PPT);
        this.mapExtensionsGroup(EXT_XLS, GROUP_XLS);
        this.mapExtensionsGroup(EXT_ACCDB, GROUP_ACCDB);
        this.mapExtensionsGroup(EXT_PDF, GROUP_PDF);
        this.mapExtensionsGroup(EXT_RM, GROUP_RM);
        this.mapExtensionsGroup(EXT_MOV, GROUP_MOV);
        this.mapExtensionsGroup(EXT_WMA, GROUP_WMA);
        this.mapExtensionsGroup(EXT_SWF, GROUP_SWF);
        this.mapExtensionsGroup(EXT_VIDEO, GROUP_VIDEO);
        this.mapExtensionsGroup(EXT_MUSIC, GROUP_MUSIC);
        this.mapExtensionsGroup(EXT_ARCHIVE, GROUP_ARCHIVE);
        this.mapExtensionsGroup(EXT_OPEN_OFFICE, GROUP_OPEN_OFFICE);
        this.mapExtensionsGroup(EXT_ODT, GROUP_ODT);
        this.mapExtensionsGroup(EXT_ODP, GROUP_ODP);
        this.mapExtensionsGroup(EXT_ODG, GROUP_ODG);
        this.mapExtensionsGroup(EXT_ODS, GROUP_ODS);
        this.mapExtensionsGroup(EXT_ODF, GROUP_ODF);
        this.mapExtensionsGroup(EXT_ODB, GROUP_ODB);
        this.mapExtensionsGroup(EXT_DWG, GROUP_DWG);
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
