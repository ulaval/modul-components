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
const EXT_CODE: string = 'js,ts,json,css,scss';
const EXT_MARKUP: string = 'html,xml';

// EXTENSIONS GROUPS
const GROUP_IMAGE: string = 'm-svg__file-image';
const GROUP_TEXT: string = 'm-svg__file-text';
const GROUP_WORD: string = 'm-svg__file-word';
const GROUP_VISIO: string = 'm-svg__file-visio';
const GROUP_POWERPOINT: string = 'm-svg__file-powerpoint';
const GROUP_EXCEL: string = 'm-svg__file-excel';
const GROUP_ACCESS: string = 'm-svg__file-access';
const GROUP_PDF: string = 'm-svg__file-pdf';
const GROUP_REALPLAYER: string = 'm-svg__file-realplayer';
const GROUP_QUICKTIME: string = 'm-svg__file-quicktime';
const GROUP_MEDIAPLAYER: string = 'm-svg__file-mediaplayer';
const GROUP_FLASH: string = 'm-svg__file-flash';
const GROUP_VIDEO: string = 'm-svg__file-video';
const GROUP_AUDIO: string = 'm-svg__file-audio';
const GROUP_ZIP: string = 'm-svg__file-zip';
const GROUP_OPENOFFICE_DEFAULT: string = 'm-svg__file-openoffice-default';
const GROUP_OPENOFFICE_WRITTER: string = 'm-svg__file-openoffice-writter';
const GROUP_OPENOFFICE_IMPRESS: string = 'm-svg__file-openoffice-impress';
const GROUP_OPENOFFICE_DRAW: string = 'm-svg__file-openoffice-draw';
const GROUP_OPENOFFICE_CALC: string = 'm-svg__file-openoffice-calc';
const GROUP_OPENOFFICE_MATH: string = 'm-svg__file-openoffice-math';
const GROUP_OPENOFFICE_BASE: string = 'm-svg__file-openoffice-base';
const GROUP_DWG: string = 'm-svg__file-dwg';
const GROUP_CODE: string = 'm-svg__file-code';
const GROUP_MARKUP: string = 'm-svg__file-markup';
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
        this.mapExtensionsGroup(EXT_DOC, GROUP_WORD);
        this.mapExtensionsGroup(EXT_VSD, GROUP_VISIO);
        this.mapExtensionsGroup(EXT_PPT, GROUP_POWERPOINT);
        this.mapExtensionsGroup(EXT_XLS, GROUP_EXCEL);
        this.mapExtensionsGroup(EXT_ACCDB, GROUP_ACCESS);
        this.mapExtensionsGroup(EXT_PDF, GROUP_PDF);
        this.mapExtensionsGroup(EXT_RM, GROUP_REALPLAYER);
        this.mapExtensionsGroup(EXT_MOV, GROUP_QUICKTIME);
        this.mapExtensionsGroup(EXT_WMA, GROUP_MEDIAPLAYER);
        this.mapExtensionsGroup(EXT_SWF, GROUP_FLASH);
        this.mapExtensionsGroup(EXT_VIDEO, GROUP_VIDEO);
        this.mapExtensionsGroup(EXT_MUSIC, GROUP_AUDIO);
        this.mapExtensionsGroup(EXT_ARCHIVE, GROUP_ZIP);
        this.mapExtensionsGroup(EXT_OPEN_OFFICE, GROUP_OPENOFFICE_DEFAULT);
        this.mapExtensionsGroup(EXT_ODT, GROUP_OPENOFFICE_WRITTER);
        this.mapExtensionsGroup(EXT_ODP, GROUP_OPENOFFICE_IMPRESS);
        this.mapExtensionsGroup(EXT_ODG, GROUP_OPENOFFICE_DRAW);
        this.mapExtensionsGroup(EXT_ODS, GROUP_OPENOFFICE_CALC);
        this.mapExtensionsGroup(EXT_ODF, GROUP_OPENOFFICE_MATH);
        this.mapExtensionsGroup(EXT_ODB, GROUP_OPENOFFICE_BASE);
        this.mapExtensionsGroup(EXT_DWG, GROUP_DWG);
        this.mapExtensionsGroup(EXT_CODE, GROUP_CODE);
        this.mapExtensionsGroup(EXT_MARKUP, GROUP_MARKUP);
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
