import uuid from '../uuid/uuid';
import { PluginObject } from 'vue';
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
    }

    private getStore(name?: string): FileStore {
        return this.stores[name ? name : DEFAULT_STORE_NAME];
    }
}

class FileStore {
    private allfiles: { [uid: string]: MFile } = {};

    public get files(): MFile[] {
        const file: MFile[] = [];
        for (const f in this.allfiles) {
            file.push(this.allfiles[f]);
        }
        return file;
    }

    public add(files: FileList) {
        for (let i = 0; i < files.length; ++i) {
            const file = files.item[i];

            const mfile: MFile = {
                uid: uuid.generate(),
                name: file.name,
                file: file
            };

            Object.freeze(mfile); // disable vuejs reactivity
            this.allfiles[mfile.uid] = mfile;
        }
    }

    public remove(uid: string) {
        delete this.files[uid];
    }

    public clear() {
        this.allfiles = {};
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
