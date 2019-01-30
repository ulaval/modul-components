import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { Messages } from '../../utils/i18n/i18n';
import { ICON_FILE_NAME } from '../component-names';
import IconPluggin from '../icon/icon';
import WithRender from './icon-file.html';

// Extensions list
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
const EXT_MARKUP_XML: string = 'xml';
const EXT_MARKUP_HTML: string = 'html,htm';
const EXT_CODE_CSS: string = 'css,scss';
const EXT_CODE_JSON: string = 'json';
const EXT_CODE_SCRIPT: string = 'js,ts';

// Extensions Groups
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

// Extensions Tooltips
const TOOLTIP_IMAGE: string = 'image';
const TOOLTIP_TEXT: string = 'txt';
const TOOLTIP_WORD: string = 'doc';
const TOOLTIP_VISIO: string = 'vsd';
const TOOLTIP_POWERPOINT: string = 'ppt';
const TOOLTIP_EXCEL: string = 'xls';
const TOOLTIP_ACCESS: string = 'accdb';
const TOOLTIP_PDF: string = 'pdf';
const TOOLTIP_REALPLAYER: string = 'rm';
const TOOLTIP_QUICKTIME: string = 'mov';
const TOOLTIP_MEDIAPLAYER: string = 'wma';
const TOOLTIP_FLASH: string = 'swf';
const TOOLTIP_VIDEO: string = 'video';
const TOOLTIP_AUDIO: string = 'music';
const TOOLTIP_ZIP: string = 'zip';
const TOOLTIP_OPENOFFICE_DEFAULT: string = 'openoffice1';
const TOOLTIP_OPENOFFICE_WRITTER: string = 'odt';
const TOOLTIP_OPENOFFICE_IMPRESS: string = 'odp';
const TOOLTIP_OPENOFFICE_DRAW: string = 'odg';
const TOOLTIP_OPENOFFICE_CALC: string = 'ods';
const TOOLTIP_OPENOFFICE_MATH: string = 'odf';
const TOOLTIP_OPENOFFICE_BASE: string = 'odb';
const TOOLTIP_DWG: string = 'dwg';
const TOOLTIP_MARKUP_XML: string = 'xml';
const TOOLTIP_MARKUP_HTML: string = 'html';
const TOOLTIP_CODE_CSS: string = 'css';
const TOOLTIP_CODE_JSON: string = 'json';
const TOOLTIP_CODE_SCRIPT: string = 'js';
const TOOLTIP_OTHER: string = 'default';

type FileGroup = {
    [key: string]: string
};

@WithRender
@Component
export class MIconFile extends Vue {
    @Prop()
    public extension: string;
    @Prop()
    public $i18n: Messages;

    @Prop({ default: '24px' })
    public size: string;

    private tooltipGroup: FileGroup = {};
    private fileMap: FileGroup = {};

    @Emit('click')
    onClick(event: Event): void { }

    @Emit('keydown')
    onKeydown(event: Event): void { }

    public get spriteId(): string {
        let cleanExtension: string = this.extension ? this.extension.replace('.', '').toLowerCase() : '';
        return this.fileMap[cleanExtension] || GROUP_OTHER;
    }

    public beforeMount(): void {
        this.mapExtensionsGroup(EXT_IMAGE, GROUP_IMAGE, TOOLTIP_IMAGE);
        this.mapExtensionsGroup(EXT_TEXT, GROUP_TEXT, TOOLTIP_TEXT);
        this.mapExtensionsGroup(EXT_DOC, GROUP_WORD, TOOLTIP_WORD);
        this.mapExtensionsGroup(EXT_VSD, GROUP_VISIO, TOOLTIP_VISIO);
        this.mapExtensionsGroup(EXT_PPT, GROUP_POWERPOINT, TOOLTIP_POWERPOINT);
        this.mapExtensionsGroup(EXT_XLS, GROUP_EXCEL, TOOLTIP_EXCEL);
        this.mapExtensionsGroup(EXT_ACCDB, GROUP_ACCESS, TOOLTIP_ACCESS);
        this.mapExtensionsGroup(EXT_PDF, GROUP_PDF, TOOLTIP_PDF);
        this.mapExtensionsGroup(EXT_RM, GROUP_REALPLAYER, TOOLTIP_REALPLAYER);
        this.mapExtensionsGroup(EXT_MOV, GROUP_QUICKTIME, TOOLTIP_QUICKTIME);
        this.mapExtensionsGroup(EXT_WMA, GROUP_MEDIAPLAYER, TOOLTIP_MEDIAPLAYER);
        this.mapExtensionsGroup(EXT_SWF, GROUP_FLASH, TOOLTIP_FLASH);
        this.mapExtensionsGroup(EXT_VIDEO, GROUP_VIDEO, TOOLTIP_VIDEO);
        this.mapExtensionsGroup(EXT_MUSIC, GROUP_AUDIO, TOOLTIP_AUDIO);
        this.mapExtensionsGroup(EXT_ARCHIVE, GROUP_ZIP, TOOLTIP_ZIP);
        this.mapExtensionsGroup(EXT_OPEN_OFFICE, GROUP_OPENOFFICE_DEFAULT, TOOLTIP_OPENOFFICE_DEFAULT);
        this.mapExtensionsGroup(EXT_ODT, GROUP_OPENOFFICE_WRITTER, TOOLTIP_OPENOFFICE_WRITTER);
        this.mapExtensionsGroup(EXT_ODP, GROUP_OPENOFFICE_IMPRESS, TOOLTIP_OPENOFFICE_IMPRESS);
        this.mapExtensionsGroup(EXT_ODG, GROUP_OPENOFFICE_DRAW, TOOLTIP_OPENOFFICE_DRAW);
        this.mapExtensionsGroup(EXT_ODS, GROUP_OPENOFFICE_CALC, TOOLTIP_OPENOFFICE_CALC);
        this.mapExtensionsGroup(EXT_ODF, GROUP_OPENOFFICE_MATH, TOOLTIP_OPENOFFICE_MATH);
        this.mapExtensionsGroup(EXT_ODB, GROUP_OPENOFFICE_BASE, TOOLTIP_OPENOFFICE_BASE);
        this.mapExtensionsGroup(EXT_DWG, GROUP_DWG, TOOLTIP_DWG);
        this.mapExtensionsGroup(EXT_CODE_CSS, GROUP_CODE, TOOLTIP_CODE_CSS);
        this.mapExtensionsGroup(EXT_CODE_JSON, GROUP_CODE, TOOLTIP_CODE_JSON);
        this.mapExtensionsGroup(EXT_CODE_SCRIPT, GROUP_CODE, TOOLTIP_CODE_SCRIPT);
        this.mapExtensionsGroup(EXT_MARKUP_XML, GROUP_MARKUP, TOOLTIP_MARKUP_XML);
        this.mapExtensionsGroup(EXT_MARKUP_HTML, GROUP_MARKUP, TOOLTIP_MARKUP_HTML);
    }

    public get svgTitle(): string {
        let cleanExtension: string = this.extension ? this.extension.replace('.', '').toLowerCase() : '';
        let currentTooltip: string = this.tooltipGroup[cleanExtension] || TOOLTIP_OTHER;
        let i18n: Messages = (Vue.prototype).$i18n;
        let tooltipContent: string = i18n.translate(`m-icon-file:${currentTooltip}`);

        return tooltipContent;
    }

    private mapExtensionsGroup(extensions, category: string, tooltip: string): void {
        extensions.split(',').forEach(ex => this.fileMap[ex] = category);
        extensions.split(',').forEach(ex => this.tooltipGroup[ex] = tooltip);

    }
}

const IconFilePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPluggin);
        v.component(ICON_FILE_NAME, MIconFile);
    }
};

export default IconFilePlugin;
