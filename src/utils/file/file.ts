import uuid from '../uuid/uuid';
import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../vue/vue';

export interface MFile {
    uid: string;
    name: string;
    file: File;
}

const DEFAULT_STORE_NAME = 'DEFAULT';

export class FileService {
    private stores: { [name: string]: FileStore } = {};

    public files(storeName?: string): MFile[] {
        return this.getStore(storeName).files;
    }

    public add(files: FileList, storeName?: string) {
        this.getStore(storeName).add(files);
    }

    public remove(fileuid: string, storeName?: string) {
        this.getStore(storeName).remove(fileuid);
    }

    public clear(storeName?: string) {
        this.getStore(storeName).clear();
        delete this.stores[this.getStoreName(storeName)];
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

class FileStore {
    private filesmap: { [uid: string]: MFile } = {};
    private rx: FileStoreRx;

    constructor() {
        this.rx = new Vue({
            data: {
                files: []
            }
        });
    }

    public get files(): MFile[] {
        return this.rx.files;
    }

    public add(files: FileList) {
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            const mfile: MFile = {
                uid: uuid.generate(),
                name: file.name,
                file: file
            };

            Object.freeze(mfile); // disable vuejs reactivity
            this.filesmap[mfile.uid] = mfile;
        }

        this.refreshRx();
    }

    public remove(uid: string) {
        delete this.files[uid];
    }

    public clear() {
        this.rx.$destroy();
    }

    private refreshRx() {
        const files: MFile[] = [];
        for (const f in this.filesmap) {
            files.push(this.filesmap[f]);
        }
        this.rx.files = files;
    }
}

const FilePlugin: PluginObject<any> = {
    install(v, options) {
        console.debug('$file', 'plugin.install');
        let file: FileService = new FileService();
        (v as any).$file = file;
        (v.prototype as any).$file = file;
    }
};

export default FilePlugin;
