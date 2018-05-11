import filesize from 'filesize';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import FileDropPlugin from '../../directives/file-drop/file-drop';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import FilePlugin, { DEFAULT_STORE_NAME, MFile, MFileRejectionCause, MFileStatus } from '../../utils/file/file';
import { Messages } from '../../utils/i18n/i18n';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { FILE_UPLOAD_NAME } from '../component-names';
import DialogPlugin, { MDialog } from '../dialog/dialog';
import FileSelectPlugin from '../file-select/file-select';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import ProgressPlugin, { MProgressState } from '../progress/progress';
import WithRender from './file-upload.html?style=./file-upload.scss';

const COMPLETED_FILES_VISUAL_HINT_DELAY: number = 1000;

interface MFileExt extends MFile {
    completeHinted: boolean;
    isOldRejection: boolean;
}

let filesizeSymbols: { [name: string]: string } | undefined = undefined;

const defaultDragEvent = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'none';
};

@WithRender
@Component({
    filters: {
        fileSize(bytes: number): string {
            if (!filesizeSymbols) {
                const i18n: Messages = (Vue.prototype as any).$i18n;
                filesizeSymbols = {
                    B: i18n.translate('m-file-upload:size-b'),
                    KB: i18n.translate('m-file-upload:size-kb'),
                    MB: i18n.translate('m-file-upload:size-mb'),
                    GB: i18n.translate('m-file-upload:size-gb')
                };
            }

            return filesize(bytes, {
                symbols: filesizeSymbols
            });
        }
    },
    mixins: [
        MediaQueries
    ]
})
export class MFileUpload extends ModulVue {
    @Prop()
    public extensions?: string[];
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

    $refs: {
        dialog: MDialog;
    };

    private title: string = this.$i18n.translate('m-file-upload:header-title');
    private internalOpen: boolean = false;

    private created(): void {
        this.$file.setValidationOptions(
            {
                extensions: this.extensions,
                maxSizeKb: this.maxSizeKb,
                maxFiles: this.maxFiles
            },
            this.storeName
        );
    }

    private destroyed(): void {
        this.$file.destroy(this.storeName);
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
        const nbNewRejection = this.rejectedFiles.reduce((cnt, f) => {
            let nbNewRejection = 0;
            if (!f.isOldRejection) {
                ++nbNewRejection;
                f.isOldRejection = true;
            }
            return cnt + nbNewRejection;
        }, 0);

        if (nbNewRejection > 0) {
            this.$refs.dialog.$refs.body.scrollTop = 0;
            // TODO Change function to have a smooth scroll when it will work on a diferent element than the body of the page
            // ScrollTo.startScroll(bodyRef, 0, ScrollToDuration.Regular);
        }
    }

    private onMessageClose(): void {
        for (const f of this.rejectedFiles) {
            this.$file.remove(f.uid, this.storeName);
        }
    }

    private onAddClick(): void {
        this.$emit('done', this.completedFiles);
        this.$refs.dialog.closeDialog();
    }

    private onCancelClick(): void {
        this.$emit('cancel');
        this.$refs.dialog.closeDialog();
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
        // We need 2 nextTick to be able to have the wrap element in the DOM - MODUL-118
        Vue.nextTick(() => {
            Vue.nextTick(() => {
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
                    this.$refs.dialog.$refs.dialogWrap.addEventListener(evt, defaultDragEvent);
                });
            });
        });
    }

    private onClose(): void {
        this.propOpen = false;
        this.$emit('close');
        this.allFiles
            .filter(f => f.status === MFileStatus.UPLOADING)
            .forEach(this.onUploadCancel);
        this.$file.clear(this.storeName);
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
            this.$refs.dialog.$refs.dialogWrap.removeEventListener(evt, defaultDragEvent);
        });
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

    private hasExtensionsRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_TYPE;
    }

    private hasSizeRejection(file): boolean {
        return file.rejection === MFileRejectionCause.FILE_SIZE;
    }

    private hasMaxFilesRejection(file): boolean {
        return file.rejection === MFileRejectionCause.MAX_FILES;
    }

    private get fileExtensions(): string {
        return this.extensions ? this.extensions.join(', ') : '';
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

    private get hasRejectedFiles(): boolean {
        return this.rejectedFiles.length !== 0;
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
}

const FileUploadPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(FILE_UPLOAD_NAME, 'plugin.install');
        v.use(FilePlugin);
        v.use(FileDropPlugin);
        v.use(FileSelectPlugin);
        v.use(DialogPlugin);
        v.use(ProgressPlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(MessagePlugin);
        v.use(LinkPlugin);
        v.use(MediaQueriesPlugin);
        v.component(FILE_UPLOAD_NAME, MFileUpload);
    }
};

export default FileUploadPlugin;
