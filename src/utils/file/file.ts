import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import Vue, { PluginObject } from 'vue';

import { RequestConfig } from '../http/rest';
import uuid from '../uuid/uuid';
import { ModulVue } from '../vue/vue';

export const DEFAULT_STORE_NAME: string = 'DEFAULT';

export interface MFile {
    uid: string;
    name: string;
    extension: string;
    file: File;
    status: MFileStatus;
    progress: number;
    rejection?: MFileRejectionCause;
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
    extensions?: string[];
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

    public cancelUpload(fileuid: string, storeName?: string): void {
        this.getStore(storeName).cancelUpload(fileuid);
    }

    private getStoreName(name?: string): string {
        return name ? name : DEFAULT_STORE_NAME;
    }

    private getStore(name?: string): FileStore {
        const storeName = this.getStoreName(name);
        let store = this.stores[storeName];
        if (!store) {
            store = this.stores[storeName] = new FileStore();
        }

        return store;
    }
}

interface FileStoreRx extends Vue {
    files: MFile[];
}

const extractExtension = (file: File): string => {
    const match = file.name.match(/\.([a-zA-Z0-9]{3,4})$/);
    return match ? match[1].toLowerCase() : '';
};

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
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            const mfile: MFile = {
                uid: uuid.generate(),
                name: file.name,
                file: file,
                status: MFileStatus.READY,
                progress: 0,
                get extension() {
                    return extractExtension(file);
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
        const file = this.getFile(fileuid);

        const onUploadProgress = (e: ProgressEvent) => {
            file.progress = e.loaded / e.total * 100;
            if (options.onUploadProgress) {
                options.onUploadProgress(e);
            }
        };

        const httpService = (Vue.prototype as ModulVue).$http;
        const cfg: RequestConfig = {
            method: 'POST',
            rawUrl: options.url,
            data: file.file,
            headers: {
                'Content-Type': file.file.type
            },
            ...options.config
        };

        const cancelToken = axios.CancelToken.source();
        this.cancelTokens[fileuid] = cancelToken;

        const axiosOptions: AxiosRequestConfig = {
            onUploadProgress: onUploadProgress,
            cancelToken: cancelToken.token
        };

        file.status = MFileStatus.UPLOADING;
        const promise = httpService.execute<T>(cfg, axiosOptions);

        return promise
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

    public cancelUpload(fileuid: string): void {
        this.cancelTokens[fileuid].cancel();
        delete this.cancelTokens[fileuid];
    }

    private validate(file: MFile): void {
        if (!this.options) {
            return;
        }

        if (this.options.extensions) {
            this.validateExtension(file);
        }

        if (this.options.maxSizeKb) {
            this.validateSize(file);
        }

        if (this.options.maxFiles) {
            this.validateMaxFiles(file);
        }
    }

    private validateExtension(file: MFile): void {
        const ext = extractExtension(file.file);

        if (this.options!.extensions!.indexOf(ext) === -1) {
            file.status = MFileStatus.REJECTED;
            file.rejection = MFileRejectionCause.FILE_TYPE;
        }
    }

    private validateSize(file: MFile): void {
        if (file.file.size / 1024 > this.options!.maxSizeKb!) {
            file.status = MFileStatus.REJECTED;
            file.rejection = MFileRejectionCause.FILE_SIZE;
        }
    }

    private validateMaxFiles(file: MFile): void {
        const nbValidFiles = Object.keys(this.filesmap).reduce((t, uid) => {
            let f = this.filesmap[uid];
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
        console.debug('$file', 'plugin.install');
        let file: FileService = new FileService();
        (v.prototype as any).$file = file;
    }
};

export default FilePlugin;
