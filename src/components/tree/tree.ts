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

    internalIsOpen: boolean = false;
    internalFolderIcon: string = FOLDER_CLOSED;

    created(): void {
        this.internalIsOpen = (this.openFolders.length && this.openFolders.indexOf(this.node.relativePath) !== -1) ? true : false;
        this.manageFolderIcon();
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

    openClose(): void {
        this.isOpen = !this.isOpen;
        this.manageFolderIcon();
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
        return this.internalIsOpen;
    }

    set isOpen(open: boolean) {
        this.internalIsOpen = open;
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
