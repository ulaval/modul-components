import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import BadgePlugin, { MBadgeState } from '../../directives/badge/badge';
import FileDropPlugin from '../../directives/file-drop/file-drop';
import FileSizeFilterPlugin from '../../filters/filesize/filesize';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import FilePlugin, { DEFAULT_STORE_NAME, MFile, MFileRejectionCause, MFileStatus } from '../../utils/file/file';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import UserAgentUtil from '../../utils/user-agent/user-agent';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { FILE_UPLOAD_NAME } from '../component-names';
import FileSelectPlugin from '../file-select/file-select';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import ModalPlugin, { MModal } from '../modal/modal';
import ProgressPlugin, { MProgressState } from '../progress/progress';
import WithRender from './file-upload.html?style=./file-upload.scss';

const COMPLETED_FILES_VISUAL_HINT_DELAY: number = 1000;

export interface MFileExt extends MFile {
    completeHinted: boolean;
    isOldRejection: boolean;
}

const defaultDragEvent: (e: DragEvent) => void = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'none';
};

@WithRender
@Component({
    mixins: [
        MediaQueries
    ]
})
export class MFileUpload extends ModulVue {
    @Prop({ default: () => [] })
    public allowedExtensions: string[];
    @Prop({ default: () => [] })
    public rejectedExtensions: string[];
    @Prop()
    public maxSizeKb?: number;
    @Prop()
    public maxFiles?: number;
    @Prop({
        default: DEFAULT_STORE_NAME
    })
    public storeName: string;
    @Prop()
    public open: boolean;
    @Prop({ default: false })
    public fileReplacement: boolean;

    $refs: {
        modal: MModal;
    };

    public get isDropZoneEnabled(): boolean {
        return UserAgentUtil.isDesktop() && this.$mq.state.isMqMinS;
    }

    private internalOpen: boolean = false;
    private tooltipCancel: string = this.$i18n.translate('m-file-upload:cancelFileUpload');
    private tooltipDelete: string = this.$i18n.translate('m-file-upload:deleteUploadedFile');

    private created(): void {
        this.updateValidationOptions();
    }

    private destroyed(): void {
        this.$file.destroy(this.storeName);
    }

    @Watch('allowedExtensions')
    @Watch('rejectedExtensions')
    @Watch('maxSizeKb')
    @Watch('maxFiles')
    private updateValidationOptions(): void {
        this.$file.setValidationOptions(
            {
                allowedExtensions: this.allowedExtensions,
                rejectedExtensions: this.rejectedExtensions,
                maxSizeKb: this.maxSizeKb,
                maxFiles: this.propMaxFiles
            },
            this.storeName
        );
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.internalOpen = open;
    }

    @Watch('readyFiles')
    private onFilesChanged(): void {
        const newReadyFiles: MFileExt[] = [];

        for (const f of this.readyFiles) {
            if (!f.hasOwnProperty('completeHinted')) {
                this.$set(f, 'completeHinted', false);
                newReadyFiles.push(f);
            }
        }

        if (newReadyFiles.length > 0) {
            this.$emit('files-ready', this.readyFiles);
        }
    }

    @Watch('freshlyCompletedFiles')
    private onFreshlyCompletedFilesChanged(): void {
        if (this.freshlyCompletedFiles.length > 0) {
            setTimeout(() => {
                for (const f of this.freshlyCompletedFiles) {
                    f.completeHinted = true;
                }
            }, COMPLETED_FILES_VISUAL_HINT_DELAY);
        }
    }

    @Watch('rejectedFiles')
    private onFilesRejected(): void {
        const nbNewRejection: number = this.rejectedFiles.reduce((cnt, f) => {
            let nbNewRejection: number = 0;
            if (!f.isOldRejection) {
                ++nbNewRejection;
                f.isOldRejection = true;
            }
            return cnt + nbNewRejection;
        }, 0);

        if (nbNewRejection > 0) {
            this.$refs.modal.$refs.body.scrollTop = 0;
            // TODO Change function to have a smooth scroll when it will work on a diferent element than the body of the page
            // ScrollTo.startScroll(bodyRef, 0, ScrollToDuration.Regular);
        }
    }

    private onPortalAfterOpen(): void {
        this.dropEvents.forEach((evt) => {
            this.$refs.modal.$refs.modalWrap.addEventListener(evt, defaultDragEvent);
        });
    }

    private onMessageClose(): void {
        for (const f of this.rejectedFiles) {
            this.$file.remove(f.uid, this.storeName);
        }
    }

    private onAddClick(): void {
        this.$emit('done', this.completedFiles);
        this.$refs.modal.closeModal();
    }

    private onCancelClick(): void {
        this.$emit('cancel');
        this.$refs.modal.closeModal();
    }

    private onUploadCancel(file: MFile): void {
        file.status === MFileStatus.UPLOADING
            ? this.$emit('file-upload-cancel', file)
            : this.onFileRemove(file);
    }

    private onFileRemove(file: MFile): void {
        this.$emit('file-remove', file);
        this.$file.remove(file.uid, this.storeName);
    }

    private onOpen(): void {
        this.$emit('open');
        this.propOpen = true;
        this.updateValidationOptions();
    }

    private onClose(): void {
        this.propOpen = false;
        this.$emit('close');
        this.allFiles
            .filter(f => f.status === MFileStatus.UPLOADING)
            .forEach(this.onUploadCancel);
        this.$file.clear(this.storeName);
        this.dropEvents.forEach((evt) => {
            this.$refs.modal.$refs.modalWrap.removeEventListener(evt, defaultDragEvent);
        });
    }

    private getFileStatus(file): string {
        switch (file.status) {
            case MFileStatus.FAILED:
                return MProgressState.Error;
            case MFileStatus.COMPLETED:
                return MProgressState.Completed;
            default:
                return MProgressState.InProgress;
        }
    }

    private getBadgeState(file): string | undefined {
        switch (file.status) {
            case MFileStatus.FAILED:
                return MBadgeState.Error;
            case MFileStatus.COMPLETED:
                return MBadgeState.Completed;
            default:
                return undefined;
        }
    }

    private hasExtensionsRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_TYPE;
    }

    private hasSizeRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_SIZE;
    }

    private hasMaxFilesRejection(file): boolean {
        return file.rejection === MFileRejectionCause.MAX_FILES;
    }

    public get title(): string {
        return this.fileReplacement ? this.$i18n.translate('m-file-upload:header-title-file-replacement') : this.$i18n.translate('m-file-upload:header-title', {}, this.propMaxFiles);
    }

    public get buttonAdd(): string {
        return this.fileReplacement ? this.$i18n.translate('m-file-upload:replace') : this.$i18n.translate('m-file-upload:add');
    }

    private get fileAllowedExtensions(): string {
        return this.allowedExtensions.join(', ');
    }

    private get isAddBtnEnabled(): boolean {
        return (
            this.completedFiles.length > 0 && this.uploadingFilesOnly.length === 0
        );
    }

    private get readyFiles(): MFileExt[] {
        return this.allFiles.filter(f => f.status === MFileStatus.READY);
    }

    private get freshlyCompletedFiles(): MFileExt[] {
        return this.allFiles.filter(
            f => f.status === MFileStatus.COMPLETED && !f.completeHinted
        );
    }

    private get uploadingFilesOnly(): MFileExt[] {
        return this.allFiles.filter(
            f =>
                f.status === MFileStatus.UPLOADING ||
                (f.status === MFileStatus.COMPLETED && !f.completeHinted)
        );
    }

    private get uploadingFiles(): MFileExt[] {
        return this.allFiles.filter(
            f =>
                f.status === MFileStatus.UPLOADING ||
                f.status === MFileStatus.FAILED ||
                (f.status === MFileStatus.COMPLETED && !f.completeHinted)
        );
    }

    private get completedFiles(): MFileExt[] {
        return this.allFiles.filter(
            f => f.status === MFileStatus.COMPLETED && f.completeHinted
        );
    }

    private get rejectedFiles(): MFileExt[] {
        return this.allFiles.filter(f => f.status === MFileStatus.REJECTED);
    }

    private get allFiles(): MFileExt[] {
        return this.$file.files(this.storeName) as MFileExt[];
    }

    private get hasUploadingFiles(): boolean {
        return this.uploadingFiles.length === 0;
    }

    private get hasCompletedFiles(): boolean {
        return this.completedFiles.length === 0;
    }

    private get buttonCompletedStyle(): string | undefined {
        return !this.hasCompletedFiles ? 'display: flex;' : undefined;
    }

    private get hasRejectedFiles(): boolean {
        return this.rejectedFiles.length !== 0;
    }

    private get hasAllowedExtensions(): boolean {
        return this.allowedExtensions.length > 0;
    }

    private get propOpen(): boolean {
        return this.open ? this.open : this.internalOpen;
    }

    private set propOpen(value) {
        if (value !== this.internalOpen) {
            this.internalOpen = value;
            this.$emit('update:open', value);
        }
    }

    private get propMaxFiles(): number | undefined {
        return this.fileReplacement ? 1 : this.maxFiles;
    }

    private get multipleSelection(): boolean {
        return this.propMaxFiles !== undefined && this.propMaxFiles > 1;
    }

    private get dropEvents(): string[] {
        return ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];
    }
}

const FileUploadPlugin: PluginObject<any> = {
    install(v, options): void {
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
        v.use(MediaQueriesPlugin);
        v.use(FileSizeFilterPlugin);
        v.use(BadgePlugin);
        v.component(FILE_UPLOAD_NAME, MFileUpload);
    }
};

export default FileUploadPlugin;
