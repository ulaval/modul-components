import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload.html?style=./upload.scss';
import { UPLOAD_NAME } from '../component-names';
import { arrayBufferToBase64 } from '../../utils/base64/base64';

const ERROR_FOLDER: string = 'ERROR_FOLDER';
const ERROR_MAX_FILES: string = 'ERROR_MAX_FILES';
const ERROR_MAX_SIZE: string = 'ERROR_MAX_SIZE';
const ERROR_DUPLICATE: string = 'ERROR_DUPLICATE';
const ERROR_EXTENSION: string = 'ERROR_EXTENSION';
const ERROR_ABORT: string = 'ERROR_ABORT';
const ERROR_LOADING: string = 'ERROR_LOADING';
const ERROR_MULTIPLE: string = 'ERROR_MULTIPLE';

const GLOBAL_ERROR: string = 'GLOBAL_ERROR';

export interface MUploadInterface extends Vue {
    globalFileList: GlobalFileList[];
    extensionsProp: string;
    multipleProp: boolean;
    showImageProp: boolean;
    fileAPISupport: boolean;
    addNewFiles(files: FileList): void;
}

export interface GlobalFileList {
    file: File;
    isRead: boolean;
    errorReading: boolean;
    reader?: FileReader;
    img?: any;
}

export interface IUploadError {
    [filename: string]: UploadError[];
}

export class UploadError {
    public errorKey: string;
    public param: string;
    public paramName: string;

    constructor(errorKey: string) {
        this.errorKey = errorKey;
    }
}

@WithRender
@Component
export class MUpload extends ModulVue implements MUploadInterface {

    @Prop({ default: () => [] })
    public extensions: string[];
    @Prop()
    public multiple: boolean;
    @Prop({ default: 10 })
    public maxFilesAllow: number;
    @Prop({ default: 26214400 }) // 25 Mo
    public maxSizeBytes: number;
    @Prop()
    public showImage: boolean;

    public globalFileList: GlobalFileList[] = [];
    public uploadErrors: IUploadError = {};
    public fileAPISupport: boolean = false;

    public mounted(): void {
        // Check for the various File API support.
        if ((window as any).File && (window as any).FileReader && (window as any).FileList && window.Blob) {
            this.fileAPISupport = true;
        }
    }

    // Computed data
    public get extensionsProp(): string {
        return (!this.extensions[0] || this.extensions[0].trim() == '' || this.extensions[0].trim() == '*') ? '*' : this.extensions.join();
    }

    public get multipleProp(): boolean {
        return this.multiple;
    }

    public get showImageProp(): boolean {
        return this.showImage;
    }

    public addNewFiles(files: FileList): void {
        let newFileAdded: boolean = false;

        this.uploadErrors = {};

        if (this.hasTooManyFiles(files)) {
            this.manageErrorMsg(GLOBAL_ERROR, ERROR_MAX_FILES, this.maxFilesAllow.toString(), 'MAX_NUMBER_OF_FILES');
        } else {
            if (this.multiple) {
                for (let i = 0; i < files.length; i++) {
                    newFileAdded = this.addToGlobalFilelist(files.item(i)) || newFileAdded;
                }
            } else {
                if (files.length > 1) {
                    this.manageErrorMsg(GLOBAL_ERROR, ERROR_MULTIPLE);
                } else {
                    this.globalFileList = [];
                    newFileAdded = this.addToGlobalFilelist(files.item(0));
                }
            }

            if (newFileAdded) {
                this.readFiles();
            }
        }

        this.$emit('errors', this.uploadErrors);
    }

    private addToGlobalFilelist(file: File): boolean {
        if (this.isFolder(file)) {
            this.manageErrorMsg(file.name, ERROR_FOLDER);
            return false;
        }

        if (this.isTooBig(file)) {
            this.manageErrorMsg(file.name, ERROR_MAX_SIZE, this.maxSizeBytes.toString(), 'MAX_BYTES_SIZE');
            return false;
        }

        if (this.isAlreadyAdded(file)) {
            this.manageErrorMsg(file.name, ERROR_DUPLICATE);
            return false;
        }

        if (this.extensionsProp != '*' && !this.isValidExtension(file)) {
            this.manageErrorMsg(file.name, ERROR_EXTENSION);
            return false;
        }

        this.globalFileList.push({ file: file, isRead: false, errorReading: false });
        return true;
    }

    private hasTooManyFiles(files: FileList): boolean {
        if (this.globalFileList.length + files.length > this.maxFilesAllow) {
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

    private isAlreadyAdded(file: File): boolean {
        let isAdded: boolean = false;

        for (let globalFile of this.globalFileList) {
            if (encodeURI(file.name) == encodeURI(globalFile.file.name)) {
                isAdded = true;
                break;
            }
        }

        return isAdded;
    }

    private isValidExtension(file: File): boolean {
        let isvalid: boolean = false;

        for (let extension of this.extensions) {
            if (file.name.substring(file.name.lastIndexOf('.')) == extension) {
                isvalid = true;
                break;
            }
        }

        return isvalid;
    }

    private readFiles(): boolean {
        for (let file of this.globalFileList) {
            if (!file.isRead) {
                file.reader = new FileReader();

                // Closure to capture the file information.
                file.reader.onloadend = ((file) => {
                    return (e) => {
                        if (this.showImage) {
                            if (file.file.type.match('image.*')) {
                                let arrayBuffer: ArrayBuffer = e.target.result;
                                file.img = 'data:image/' + file.file.type.substring(file.file.type.lastIndexOf('/')) + ';base64,' + arrayBufferToBase64(arrayBuffer);
                            }
                        }

                        file.isRead = true;
                    };
                })(file);

                file.reader.onabort = ((file) => {
                    return (e) => {
                        file.errorReading = true;
                        this.manageErrorMsg(file.file.name, ERROR_ABORT);
                        this.$emit('errors', this.uploadErrors);

                    };
                })(file);

                file.reader.onerror = ((file) => {
                    return (e) => {
                        file.errorReading = true;
                        this.manageErrorMsg(file.file.name, ERROR_LOADING);
                        this.$emit('errors', this.uploadErrors);
                    };
                })(file);

                // file.reader.readAsDataURL(file.file); // Return data: URL
                file.reader.readAsArrayBuffer(file.file); // Return ArrayBuffer
                // file.reader.readAsText(file.file); // Return text string
            }
        }

        return true;
    }

    private manageErrorMsg(filename: string, key: string, param?: string, paramName?: string): void {
        if (!this.uploadErrors[filename]) {
            this.uploadErrors[filename] = [];
        }

        let uploadError: UploadError = new UploadError(key);
        if (param) {
            uploadError.param = param;
        }
        if (paramName) {
            uploadError.paramName = paramName;
        }

        this.uploadErrors[filename].push(uploadError);
    }
}

const UploadPlugin: PluginObject<any> = {
    install(v, options): void {
        console.error(UPLOAD_NAME + ' is deprecated');
        v.component(UPLOAD_NAME, MUpload);
    }
};

export default UploadPlugin;
