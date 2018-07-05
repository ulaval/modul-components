import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import TreeNodePlugin from '../tree-node/tree-node';
import WithRender from './tree.html';

export interface MNodeStructureArchive {
    relativePath: string;
    idFile: string;
    fileName: string;
    childs: MNodeStructureArchive[];
}

export enum MSelectOption {
    NONE = '0',
    SINGLE = '1',
    MULTIPLE = '2'
}

@WithRender
@Component
export class MTree extends ModulVue {

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

    @Prop({ default: 'information' })
    icon: string;

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    internalSelectedFile: MNodeStructureArchive[] = [];
    openFolders: string[] = [];
    emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');

    created(): void {
        this.selectedFile = this.externalSelectedFile ? this.externalSelectedFile : [];
        this.openFolders = this.foldersToOpen(this.tree);
    }

    isTreeEmpty(): boolean {
        return !this.tree.length;
    }

    selectFile(file: MNodeStructureArchive): void {
        this.selectedFile = [file];
        this.$emit('selectNewFile', file);
    }

    set selectedFile(file: MNodeStructureArchive[]) {
        this.internalSelectedFile = file;
    }

    get selectedFile(): MNodeStructureArchive[] {
        return this.internalSelectedFile;
    }

    private foldersToOpen(files: MNodeStructureArchive[]): string[] {
        let folders: string[] = [];
        if (this.selectedFile.length) {
            files.forEach((file: MNodeStructureArchive) => {
                if (!file.idFile && this.selectedFile[0].relativePath.indexOf(file.relativePath) !== -1) {
                    folders.push(file.relativePath);
                    let recursiveFoldersToOpen: string[] = this.foldersToOpen(file.childs);
                    recursiveFoldersToOpen.forEach((relativePath: string) => {
                        folders.push(relativePath);
                    });
                }
            });
        }

        return folders;
    }

}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NAME, 'plugin.install');
        v.use(TreeNodePlugin);
        v.use(I18nPlugin);
        v.component(TREE_NAME, MTree);
    }
};

export default TreePlugin;
