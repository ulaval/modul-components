import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload.html?style=./upload.scss';
import { UPLOAD_NAME } from '../component-names';
import { arrayBufferToBase64 } from '../../utils/base64/base64';
const UNDEFINED: string = 'undefined';

const ERROR_FOLDER: string = 'm-upload:error-folder';
const ERROR_MAX_FILES: string = 'm-upload:error-max-files';
const ERROR_MAX_SIZE: string = 'm-upload:error-max-size';
const ERROR_DUPLICATE: string = 'm-upload:error-duplicate';
const ERROR_EXTENSION: string = 'm-upload:error-extension';
const ERROR_ABORT: string = 'm-upload:error-abort';
const ERROR_LOADING: string = 'm-upload:error-loading';
const ERROR_MULTIPLE: string = 'm-upload:error-multiple';

export interface GlobalFileList {
    file: File;
    isRead: boolean;
    errorReading: boolean;
    reader?: FileReader;
    img?: any;
}

@WithRender
@Component
export class MUpload extends ModulVue {

    @Prop({ default: false })
    public multiple: boolean;
    @Prop({ default: true })
    public fileInput: boolean;
    @Prop({ default: true })
    public dragDrop: boolean;
    @Prop({ default: true })
    public filesList: boolean;
    @Prop({ default: true })
    public errors: boolean;
    @Prop({ default: 10 })
    public maxFilesAllow: number;
    @Prop({ default: 26214400 }) // 25 Mo
    public maxSizeBytes: number;
    @Prop({ default: () => [] })
    public extensions: string[];
    @Prop({ default: false })
    public showImage: boolean;

    public globalFileList: GlobalFileList[] = [];
    public errorMsgs: string[] = [];

    private fileAPISupport: boolean = false;
    private extensionsProp: string;

    private dragOver: boolean = false;

    @Watch('extensions')
    public extensionsChange() {
        this.extensionsProp = ((typeof this.extensions[0] == UNDEFINED) || (this.extensions[0].trim() == '') || (this.extensions[0].trim() == '*')) ? '*' : this.extensions.join();
    }

    public created() {
        this.extensionsProp = ((typeof this.extensions[0] == UNDEFINED) || (this.extensions[0].trim() == '') || (this.extensions[0].trim() == '*')) ? '*' : this.extensions.join();
    }

    public mounted() {
        // Check for the various File API support.
        if ((window as any).File && (window as any).FileReader && (window as any).FileList && window.Blob) {
            this.fileAPISupport = true;
        }
    }

    // Computed data
    public get hasErrorMsgs(): boolean {
        if (this.errorMsgs.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public remove(index: number): void {
        this.globalFileList.splice(index, 1);
    }

    public filesInput($event: Event): void {
        let newFilesAdded: boolean = false;

        this.errorMsgs = [];

        // FileList object.
        for (let file of ($event.target as any).files) {
            newFilesAdded = this.addToGlobalFilelist(file) || newFilesAdded;
        }

        if (newFilesAdded) {
            this.readFiles();
        }
    }

    public filesDrop($event: DragEvent): void {
        let newFilesAdded: boolean = false;

        $event.stopPropagation();
        $event.preventDefault();
        this.dragOver = false;
        this.errorMsgs = [];

        let files: FileList = $event.dataTransfer.files;

        if (this.multiple) {
            for (let i = 0; i < files.length; i++) {
                let file: File = files.item(i);
                newFilesAdded = this.addToGlobalFilelist(file) || newFilesAdded;
            }
        } else {
            if (files.length == 1) {
                this.globalFileList = [];
                newFilesAdded = this.addToGlobalFilelist(files[0]);
            } else {
                this.manageErrorMsg(ERROR_MULTIPLE);
            }
        }

        if (newFilesAdded) {
            this.readFiles();
        }
    }

    private addToGlobalFilelist(file: File): boolean {
        if (this.isFolder(file)) {
            this.manageErrorMsg(ERROR_FOLDER, file);
            return false;
        }

        if (this.hasTooManyFiles()) {
            this.manageErrorMsg(ERROR_MAX_FILES, file);
            return false;
        }

        if (this.isTooBig(file)) {
            this.manageErrorMsg(ERROR_MAX_SIZE, file);

            return false;
        }

        if (this.isFileAlreadyAdded(file)) {
            this.manageErrorMsg(ERROR_DUPLICATE, file);

            return false;
        }

        if (this.extensionsProp != '*' && !this.validExtension(file)) {
            this.manageErrorMsg(ERROR_EXTENSION, file);
            return false;
        }

        this.globalFileList.push({ file: file, isRead: false, errorReading: false });
        return true;
    }

    private hasTooManyFiles(): boolean {
        if ((typeof this.maxFilesAllow != UNDEFINED) && (this.globalFileList.length >= this.maxFilesAllow)) {
            return true;
        } else {
            return false;
        }
    }

    private isTooBig(file: File): boolean {
        if (file.size > this.maxSizeBytes) {
            return true;
        } else {
            return false;
        }
    }

    private isFolder(file: File): boolean {
        if (file.type == '') {
            return true;
        } else {
            return false;
        }
    }

    private isFileAlreadyAdded(file: File): boolean {
        let isAlreadyAdded: boolean = false;

        for (let globalFile of this.globalFileList) {
            if (encodeURI(file.name) == encodeURI(globalFile.file.name)) {
                isAlreadyAdded = true;
                break;
            }
        }

        return isAlreadyAdded;
    }

    private validExtension(file: File): boolean {
        let validExt: boolean = false;

        for (let extension of this.extensions) {
            if (file.name.substring(file.name.lastIndexOf('.')) == extension) {
                validExt = true;
                break;
            }
        }

        return validExt;
    }

    private readFiles(): boolean {
        for (let file of this.globalFileList) {
            if (!file.isRead) {
                file.reader = new FileReader();

                // Closure to capture the file information.
                file.reader.onloadend = ((file) => {
                    return (e) => {
                        file.isRead = true;

                        if (this.showImage) {
                            if (file.file.type.match('image.*')) {
                                let arrayBuffer: ArrayBuffer = e.target.result;
                                file.img = 'data:image/' + file.file.type.substring(file.file.type.lastIndexOf('/')) + ';base64,' + arrayBufferToBase64(arrayBuffer);
                            }
                        }
                    };
                })(file);

                file.reader.onabort = ((file) => {
                    return (e) => {
                        file.errorReading = true;
                        this.manageErrorMsg(ERROR_ABORT, file.file);
                    };
                })(file);

                file.reader.onerror = ((file) => {
                    return (e) => {
                        file.errorReading = true;
                        this.manageErrorMsg(ERROR_LOADING, file.file);
                    };
                })(file);

                // file.reader.readAsDataURL(file.file); // Return data: URL
                file.reader.readAsArrayBuffer(file.file); // Return ArrayBuffer
                // file.reader.readAsText(file.file); // Return text string
            }
        }

        return true;
    }

    private manageErrorMsg(key: string, file?: File, params: any[] = []): void {
        if (file) {
            params.splice(0, 0, file.name);
        }
        this.errorMsgs.push(this.$i18n.translate(key, params));
    }
}

const UploadPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_NAME, MUpload);
    }
};

export default UploadPlugin;
