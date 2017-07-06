import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload.html?style=./upload.scss';
import { UPLOAD_NAME } from '../component-names';

const UNDEFINED: string = 'undefined';

export interface GlobalFileList {
    file: File;
    isRead: boolean;
    reader?: FileReader;
}

@WithRender
@Component
export class MUpload extends Vue {

    @Prop({ default: true })
    public multiple: boolean;
    @Prop({ default: true })
    public fileInput: boolean;
    @Prop({ default: true })
    public dragDrop: boolean;
    @Prop({ default: true })
    public filesList: boolean;
    @Prop({ default: 10 })
    public maxFilesAllow: number;
    @Prop({ default: () => [] })
    public extensions: string[];
    @Prop({ default: 26214400 }) // 25 Mo
    public maxSizeBytes: number;

    public globalFileList: GlobalFileList[] = [];
    public errorMsgs: string[] = [];

    private fileAPISupport: boolean = false;
    private extensionsProp: string;

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

    public filesInput($event: Event) {
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

    public filesDrop($event: DragEvent) {
        let newFilesAdded: boolean = false;

        $event.stopPropagation();
        $event.preventDefault();
        this.errorMsgs = [];

        let files: FileList = $event.dataTransfer.files;

        // FileList object.
        for (let i = 0; i < files.length; i++) {
            let file: File = files.item(i);
            newFilesAdded = this.addToGlobalFilelist(file) || newFilesAdded;
        }

        if (newFilesAdded) {
            this.readFiles();
        }
    }

    private addToGlobalFilelist(file: File): boolean {
        if (this.isFolder(file)) {
            this.errorMsgs.push(`${file.name}: Cannot add folder`);
            return false;
        }

        if (this.isTooBig(file)) {
            this.errorMsgs.push(`File ${file.name} is bigger than max size ${this.maxSizeBytes} bytes`);
            return false;
        }

        if (this.hasTooManyFiles()) {
            this.errorMsgs.push(`File ${file.name} wasn't add - Max number of files (${this.maxFilesAllow}) allow is reach`);
            return false;
        }

        if (this.isFileAlreadyAdded(file)) {
            this.errorMsgs.push(`File ${file.name} is already in list`);
            return false;
        }

        if ((this.extensionsProp != '*') && (!this.validExtension(file))) {
            this.errorMsgs.push(`File ${file.name} doesn't have a valid extension`);
            return false;
        }

        this.globalFileList.push({ file: file, isRead: false });
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
                file.reader.onload = ((file) => {
                    return (e) => {
                        file.isRead = true;
                        console.log(file.file.name + ' is done');
                    // Render thumbnail.
                    // var span = document.createElement('span');
                    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    //                     '" title="', escape(theFile.name), '"/>'].join('');
                    // document.getElementById('list').insertBefore(span, null);
                    };
                })(file);

                // Read in the image file as a data URL.
                file.reader.readAsDataURL(file.file); // Return data: URL
                // file.reader.readAsArrayBuffer(file.file); // Return ArrayBuffer
                // file.reader.readAsText(file.file); // Return text string
            }
        }

        return true;
    }
}

const UploadPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_NAME, MUpload);
    }
};

export default UploadPlugin;
