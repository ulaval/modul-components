import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MSelectOption, TreeNode } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

const FOLDER_OPEN: string = 'm-svg__file-openoffice-math';
const FOLDER_CLOSED: string = 'm-svg__file-zip';

@WithRender
@Component
export class MTreeNode<T> extends ModulVue {

    @Prop()
    node: TreeNode<T>;

    @Prop()
    externalSelectedNode: TreeNode<T>[];

    @Prop()
    icon: string;

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    selection: MSelectOption;

    internalIsOpen: boolean = false;
    internalFolderIcon: string = FOLDER_CLOSED;

    created(): void {
        this.internalIsOpen = !this.node.content['idNode'] && this.externalSelectedNode[0].content['elementPath'].indexOf(this.node.content['elementPath']) !== -1;
        this.manageFolderIcon();
    }

    isAFolder(idNode: string): boolean {
        return !idNode;
    }

    isDisabled(): boolean {
        return !this.node.childs.length;
    }

    isFileSelected(node: TreeNode<T>): boolean {
        return !!this.externalSelectedNode.length && !!node.content['idNode'] && this.externalSelectedNode[0].content['idNode'] === node.content['idNode'];
    }

    extensionFile(filename: string = ''): string {
        let extension: string = filename.split('.').pop() as string;
        return '.' + extension;
    }

    selectNode(node: TreeNode<T>): void {
        if (this.selection !== MSelectOption.MULTIPLE) {
            this.$emit('selectNode', node);
        }
    }

    openCloseIcon(): string {
        return this.isOpen ? '-' : '+';
    }

    openClose(): void {
        if (!this.isDisabled()) {
            this.isOpen = !this.isOpen;
            this.manageFolderIcon();
        }
    }

    private manageFolderIcon(): void {
        this.folderIcon = this.isOpen ? FOLDER_OPEN : FOLDER_CLOSED;
    }

    get linkMode(): string {
        return this.isInactiveButton ? 'text' : 'button';
    }

    get isInactiveButton(): boolean {
        return this.selection === MSelectOption.NONE;
    }

    get nodeTitle(): string {
        return this.node.content['elementLabel'];
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
