import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MNodeStructureArchive } from '../root-tree/root-tree';
import WithRender from './tree.html?style=./tree.scss';

const FOLDER_OPEN: string = 'm-svg__file-odf';
const FOLDER_CLOSED: string = 'm-svg__file-odb';

@WithRender
@Component
export class MTree extends ModulVue {

    @Prop()
    node: MNodeStructureArchive;

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    @Prop()
    icon: string;

    @Prop()
    openFolders: string[];

    isOpenInternal: boolean = false;

    mounted(): void {
        if (this.openFolders.length && this.openFolders.indexOf(this.node.relativePath) !== -1) {
            this.isOpen = true;
        }
    }

    get isOpen(): boolean {
        return this.isOpenInternal;
    }

    set isOpen(open: boolean) {
        this.isOpenInternal = open;
        this.$emit('update:isOpenInternal', this.isOpen);
    }

    isAFolder(idFile: string): boolean {
        return !idFile;
    }

    isEmpty(node: MNodeStructureArchive): boolean {
        return !node.childs.length;
    }

    extensionFile(filename: string = ''): string {
        let extension: string = filename.split('.').pop() as string;
        return '.' + extension;
    }

    isFileSelected(node: MNodeStructureArchive): boolean {
        return !!node.idFile && this.externalSelectedFile[0].idFile === node.idFile;
    }

    selectFile(node: MNodeStructureArchive): void {
        this.$emit('selectFile', node);
    }

    folderIcon(): string {
        return FOLDER_CLOSED;
    }

    isFolderOpen(relativePath: string): boolean | void {
        if (this.openFolders.length && this.openFolders.indexOf(relativePath) !== -1) {
            return true;
        }
    }

}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.component(TREE_NAME, MTree);
    }
};

export default TreePlugin;
