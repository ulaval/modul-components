import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MNodeStructureArchive } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

const FOLDER_OPEN: string = 'm-svg__file-openoffice-math';
const FOLDER_CLOSED: string = 'm-svg__file-zip';

@WithRender
@Component
export class MTreeNode extends ModulVue {

    @Prop()
    node: MNodeStructureArchive;

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    @Prop()
    icon: string;

    @Prop()
    openFolders: string[];

    internalIsOpen: boolean = false;
    internalFolderIcon: string = FOLDER_CLOSED;

    created(): void {
        this.internalIsOpen = (this.openFolders.length && this.openFolders.indexOf(this.node.relativePath) !== -1) ? true : false;
        this.manageFolderIcon();
    }

    isAFolder(idFile: string): boolean {
        return !idFile;
    }

    isDisabled(): boolean {
        return !this.node.childs.length;
    }

    isFileSelected(node: MNodeStructureArchive): boolean {
        return !!this.externalSelectedFile.length && !!node.idFile && this.externalSelectedFile[0].idFile === node.idFile;
    }

    extensionFile(filename: string = ''): string {
        let extension: string = filename.split('.').pop() as string;
        return '.' + extension;
    }

    selectFile(node: MNodeStructureArchive): void {
        this.$emit('selectFile', node);
    }

    openClose(): void {
        if (!this.isDisabled()) {
            this.isOpen = !this.isOpen;
            this.manageFolderIcon();
        }
    }

    openCloseIcon(): string {
        return this.isOpen ? '-' : '+';
    }

    private manageFolderIcon(): void {
        this.folderIcon = this.isOpen ? FOLDER_OPEN : FOLDER_CLOSED;
    }

    get folderIcon(): string {
        return this.internalFolderIcon;
    }

    set folderIcon(icon: string) {
        this.internalFolderIcon = icon;
    }

    get isOpen(): boolean {
        return this.internalIsOpen && !this.isDisabled();
    }

    set isOpen(open: boolean) {
        if (!this.isDisabled()) {
            this.internalIsOpen = open;
        }
    }

}

const TreeNodePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NODE_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
