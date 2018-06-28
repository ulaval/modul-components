import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ROOT_TREE_NAME } from '../component-names';
import TreePlugin from '../tree/tree';
import WithRender from './root-tree.html';

export interface MNodeStructureArchive {
    relativePath: string;
    idFile: string;
    fileName: string;
    childs: MNodeStructureArchive[];
}

export enum MSelectOption {
    NONE = 0,
    SINGLE = 1,
    MULTIPLE = 2
}

@WithRender
@Component
export class MRootTree extends ModulVue {

    @Prop()
    tree: MNodeStructureArchive[];

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    selection: MSelectOption;

    @Prop()
    icon: string;

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    initialiseFolders: boolean = true;

    internalSelectedFile: MNodeStructureArchive[] = [];

    openFolders: string[] = [];

    created(): void {
        this.selectedFile = this.externalSelectedFile;
        this.openFolders = this.foldersToOpen(this.tree);
    }

    selectNewFile(file: MNodeStructureArchive): void {
        this.selectedFile = [file];
    }

    set selectedFile(file: MNodeStructureArchive[]) {
        this.internalSelectedFile = file;
    }

    get selectedFile(): MNodeStructureArchive[] {
        return this.internalSelectedFile;
    }

    private foldersToOpen(files: MNodeStructureArchive[]): string[] {
        let folders: string[] = [];
        files.forEach((file: MNodeStructureArchive) => {
            if (!file.idFile && this.selectedFile[0].relativePath.indexOf(file.relativePath) !== -1) {
                folders.push(file.relativePath);
                let recursiveFoldersToOpen: string[] = this.foldersToOpen(file.childs);
                recursiveFoldersToOpen.forEach((relativePath: string) => {
                    folders.push(relativePath);
                });
            }
        });

        return folders;
    }

}

const RootTreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ROOT_TREE_NAME, 'plugin.install');
        v.use(TreePlugin);
        v.component(ROOT_TREE_NAME, MRootTree);
    }
};

export default RootTreePlugin;
