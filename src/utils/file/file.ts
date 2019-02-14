import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import Vue, { PluginObject } from 'vue';
import { HttpService } from '../http/http';
import { RequestConfig } from '../http/rest';
import uuid from '../uuid/uuid';
import { ModulVue } from '../vue/vue';

declare module 'vue/types/vue' {
    interface Vue {
        $file: FileService;
    }
}

export const DEFAULT_STORE_NAME: string = 'DEFAULT';

export interface MFile {
    uid: string;
    name: string;
    extension: string;
    file: File;
    status: MFileStatus;
    progress: number;
    rejection?: MFileRejectionCause;
    url?: string;
}

export enum MFileRejectionCause {
    FILE_SIZE = 'file-size',
    FILE_TYPE = 'file-type',
    MAX_FILES = 'max-files'
}

export enum MFileStatus {
    READY = 'ready',
    UPLOADING = 'uploading',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REJECTED = 'rejected',
    CANCELED = 'canceled'
}

export interface MFileUploadOptions {
    url: string;
    config?: RequestConfig;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

export interface MFileValidationOptions {
    maxFiles?: number;
    maxSizeKb?: number;
    allowedExtensions?: string[];
    rejectedExtensions?: string[];
}

export class FileService {
    private stores: { [name: string]: FileStore } = {};

    public files(storeName?: string): MFile[] {
        return this.getStore(storeName).files;
    }

    public setValidationOptions(
        options: MFileValidationOptions,
        storeName?: string
    ): void {
        this.getStore(storeName).validationOptions = options;
    }

    public add(files: FileList, storeName?: string): void {
        this.getStore(storeName).add(files);
    }

    public remove(fileuid: string, storeName?: string): void {
        this.getStore(storeName).remove(fileuid);
    }

    public clear(storeName?: string): void {
        this.getStore(storeName).clear();
    }

    public destroy(storeName?: string): void {
        this.getStore(storeName).destroy();
        delete this.stores[this.getStoreName(storeName)];
    }

    public upload<T>(
        fileuid: string,
        options: MFileUploadOptions,
        storeName?: string
    ): Promise<AxiosResponse<T>> {
        return this.getStore(storeName).upload<T>(fileuid, options);
    }

    public uploadTemp(files: MFile[], storeName?: string): void {
        this.getStore(storeName).uploadTemp(files);
    }

    public cancelUpload(fileuid: string, storeName?: string): void {
        this.getStore(storeName).cancelUpload(fileuid);
    }

    private getStoreName(name?: string): string {
        return name ? name : DEFAULT_STORE_NAME;
    }

    private getStore(name?: string): FileStore {
        const storeName: string = this.getStoreName(name);
        let store: FileStore = this.stores[storeName];
        if (!store) {
            store = this.stores[storeName] = new FileStore();
        }

        return store;
    }
}

interface FileStoreRx extends Vue {
    files: MFile[];
}

export function extractExtension(filename: string): string {
    if (filename) {
        const match: RegExpMatchArray | null = filename.match(/\.([a-zA-Z0-9]{2,4})$/);
        return match ? match[1].toLowerCase() : '';
    }
    return '';
}

class FileStore {
    private filesmap: { [uid: string]: MFile } = {};
    private cancelTokens: { [uid: string]: CancelTokenSource } = {};
    private options?: MFileValidationOptions;

    private rx: FileStoreRx;

    constructor() {
        this.rx = new Vue({
            data: {
                files: []
            }
        });
    }

    public set validationOptions(options: MFileValidationOptions) {
        this.options = options;
    }

    public get files(): MFile[] {
        return this.rx.files;
    }

    public getFile(uid: string): MFile {
        return this.filesmap[uid];
    }

    public add(files: FileList): void {
        for (let i: number = 0; i < files.length; ++i) {
            const file: File = files[i];

            const mfile: MFile = {
                uid: uuid.generate(),
                name: file.name,
                file: file,
                status: MFileStatus.READY,
                progress: 0,
                get extension(): string {
                    return extractExtension(file.name);
                }
            };

            this.validate(mfile);

            Object.freeze(mfile.file); // disable vuejs reactivity
            this.filesmap[mfile.uid] = mfile;
        }

        this.refreshRx();
    }

    public remove(uid: string): void {
        delete this.filesmap[uid];
        this.refreshRx();
    }

    public clear(): void {
        this.filesmap = {};
        this.rx.files = [];
    }

    public destroy(): void {
        this.rx.$destroy();
    }

    public upload<T>(
        fileuid: string,
        options: MFileUploadOptions
    ): Promise<AxiosResponse<T>> {
        const file: MFile = this.getFile(fileuid);

        const onUploadProgress: (e: ProgressEvent) => any = (e: ProgressEvent) => {
            file.progress = e.loaded / e.total * 100;
            if (options.onUploadProgress) {
                options.onUploadProgress(e);
            }
        };

        const httpService: HttpService = (Vue.prototype as ModulVue).$http;
        const cfg: RequestConfig = {
            method: 'POST',
            rawUrl: options.url,
            data: file.file,
            headers: {
                'Content-Type': file.file.type
            },
            ...options.config
        };

        const cancelToken: CancelTokenSource = axios.CancelToken.source();
        this.cancelTokens[fileuid] = cancelToken;

        const axiosOptions: AxiosRequestConfig = {
            onUploadProgress: onUploadProgress,
            cancelToken: cancelToken.token
        };

        file.status = MFileStatus.UPLOADING;

        return httpService.execute<T>(cfg, axiosOptions)
            .then<AxiosResponse<T>, any>(
                value => {
                    file.status = MFileStatus.COMPLETED;
                    file.progress = 100;
                    return value;
                },
                ex => {
                    file.status = axios.isCancel(ex)
                        ? MFileStatus.CANCELED
                        : MFileStatus.FAILED;
                    if (file.status === MFileStatus.FAILED) {
                        return Promise.reject(ex);
                    }
                }
            )
            .then<AxiosResponse<T>>(value => {
                delete this.cancelTokens[fileuid];
                return value;
            });
    }

    public uploadTemp(files: MFile[]): void {
        files.forEach(file => {
            let storeFile: MFile = this.getFile(file.uid);
            storeFile.url = URL.createObjectURL(file.file);
            storeFile.status = MFileStatus.COMPLETED;
            storeFile.progress = 100;
        });
    }

    public cancelUpload(fileuid: string): void {
        this.cancelTokens[fileuid].cancel();
        delete this.cancelTokens[fileuid];
    }

    private validate(file: MFile): void {
        this.validateExtension(file);

        if (!this.options) {
            return;
        }

        if (this.options.maxSizeKb) {
            this.validateSize(file);
        }

        if (this.options.maxFiles) {
            this.validateMaxFiles(file);
        }
    }

    /**
     * If the extension is not specified, it'll be rejected.
     * If the extension is a part of acceptedExtensions or if acceptedExtensions is empty or undefined, we accept all extensions.
     * If the extension is a part of rejectedExtensions, it'll be rejected.
     * If the extension is a part of the accepted and rejected extensions, it'll be rejected.
     */
    private validateExtension(file: MFile): void {
        const ext: string = extractExtension(file.file.name);

        if (ext === '' || this.extensionInRejectedExtensions(ext) || !this.extensionInAcceptedExtensions(ext)) {
            file.status = MFileStatus.REJECTED;
            file.rejection = MFileRejectionCause.FILE_TYPE;
        }
    }

    private extensionInAcceptedExtensions(extension: string): boolean {
        return this.options === undefined || this.options.allowedExtensions === undefined || this.options.allowedExtensions.length === 0 || this.options.allowedExtensions.indexOf(extension) !== -1;
    }

    private extensionInRejectedExtensions(extension: string): boolean {
        return this.options !== undefined && this.options.rejectedExtensions !== undefined && this.options.rejectedExtensions.length > 0 && this.options.rejectedExtensions.indexOf(extension) !== -1;
    }

    private validateSize(file: MFile): void {
        if (file.file.size / 1024 > this.options!.maxSizeKb!) {
            file.status = MFileStatus.REJECTED;
            file.rejection = MFileRejectionCause.FILE_SIZE;
        }
    }

    private validateMaxFiles(file: MFile): void {
        const nbValidFiles: number = Object.keys(this.filesmap).reduce((t, uid) => {
            let f: MFile = this.filesmap[uid];
            return (t =
                f.status === MFileStatus.COMPLETED ||
                    f.status === MFileStatus.READY ||
                    f.status === MFileStatus.UPLOADING
                    ? t + 1
                    : t);
        }, 0);

        if (nbValidFiles >= this.options!.maxFiles!) {
            file.status = MFileStatus.REJECTED;
            file.rejection = MFileRejectionCause.MAX_FILES;
        }
    }

    private refreshRx(): void {
        const files: MFile[] = [];
        for (const f in this.filesmap) {
            files.push(this.filesmap[f]);
        }
        this.rx.files = files;
    }
}

const FilePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('$file', 'plugin.install');
        let file: FileService = new FileService();
        (v.prototype).$file = file;
    }
};

export default FilePlugin;
