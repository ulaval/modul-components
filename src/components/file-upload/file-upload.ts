import Component from 'vue-class-component';
import WithRender from './file-upload.html?style=./file-upload.scss';
import { FILE_UPLOAD_NAME } from '../component-names';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import FilePlugin, { MFile, MFileStatus } from '../../utils/file/file';
import { Watch, Prop } from 'vue-property-decorator';
import filesize from 'filesize';
import FileDropPlugin from '../../directives/file-drop/file-drop';
import FileSelectPlugin from '../file-select/file-select';
import ProgressPlugin, { MProgressState } from '../progress/progress';
import ModalPlugin, { MModal } from '../modal/modal';
import IconPlugin from '../icon/icon';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import ButtonPlugin from '../button/button';
import MessagePlugin from '../message/message';
import LinkPlugin from '../link/link';

@WithRender
@Component({
    filters: {
        fileSize(bytes: number): string {
            return filesize(bytes);
        }
    }
})
export class MFileUpload extends ModulVue {
    @Prop() public extensions?: string[];
    @Prop() public maxSizeKb?: number;
    @Prop() public maxFiles?: number;

    private title: string = this.$i18n.translate('m-file-upload:header-title');
    private isModalOpen: boolean = false;

    private created() {
        this.$file.setValidationOptions({
            extensions: this.extensions,
            maxSizeKb: this.maxSizeKb,
            maxFiles: this.maxFiles
        });
    }

    @Watch('readyFiles')
    private onFilesChanged() {
        this.$emit('files-ready', this.readyFiles);
    }

    @Watch('rejectedFiles')
    private onRejectedFiles() {
        if (this.rejectedFiles.length > 0) {
            this.isModalOpen = true;
        }
    }

    private onModalClose() {
        this.isModalOpen = false;
        setTimeout(() => {
            for (const f of this.rejectedFiles) {
                this.$file.remove(f.uid);
            }
        }, 400);
    }

    private onAddClick() {
        this.$emit('done', this.completedFiles);
    }

    private onCancelClick() {
        this.$refs['dialog']['closeDialog']();
        this.$emit('cancel');
    }

    private onUploadCancel(file: MFile) {
        file.status === MFileStatus.UPLOADING ? this.$emit('file-upload-cancel', file) : this.onFileRemove(file);
    }

    private onFileRemove(file: MFile) {
        this.$emit('file-remove', file);
        this.$file.remove(file.uid);
    }

    private onOpen() {
        this.$emit('open');
    }

    private onClose() {
        this.$emit('close');
    }

    private getFileStatus(file): string {
        if (file.status === MFileStatus.FAILED) {
            return MProgressState.Error;
        } else if (file.status === MFileStatus.COMPLETED) {
            return MProgressState.Completed;
        } else {
            return MProgressState.InProgress;
        }
    }

    private get fileExtensions(): string {
        return this.extensions ? this.extensions.join(', ') : '';
    }

    private get isAddBtnEnabled(): boolean {
        return (
            this.completedFiles.length > 0 && this.uploadingFiles.length === 0
        );
    }

    private get readyFiles(): MFile[] {
        return this.$file.files().filter(f => f.status === MFileStatus.READY);
    }

    private get uploadingFiles(): MFile[] {
        return this.$file
            .files()
            .filter(f => f.status === MFileStatus.UPLOADING || f.status === MFileStatus.FAILED);
    }

    private get completedFiles(): MFile[] {
        return this.$file
            .files()
            .filter(f => f.status === MFileStatus.COMPLETED);
    }

    private get hasUploadingFiles(): boolean {
        return this.uploadingFiles.length === 0;
    }

    private get hasCompletedFiles(): boolean {
        return this.completedFiles.length === 0;
    }

    private get rejectedFiles(): MFile[] {
        return this.$file
            .files()
            .filter(f => f.status === MFileStatus.REJECTED);
    }
}

const FileUploadPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(FILE_UPLOAD_NAME, 'plugin.install');
        v.use(FilePlugin);
        v.use(FileDropPlugin);
        v.use(FileSelectPlugin);
        v.use(ModalPlugin);
        v.use(ProgressPlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(MessagePlugin);
        v.use(LinkPlugin);
        v.component(FILE_UPLOAD_NAME, MFileUpload);
    }
};

export default FileUploadPlugin;
