import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import FileTreePlugin from '../file-tree/file-tree';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import { MSelectOption, MTreeFormat, TreeNode } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

@WithRender
@Component
export class MTreeNode<T extends MTreeFormat> extends ModulVue {

    @Prop()
    node: TreeNode<MTreeFormat>;

    @Prop()
    externalSelectedNode: string[];

    @Prop()
    selectionIcon: string;

    @Prop()
    selectionNumber: MSelectOption;

    @Prop()
    isAllOpen: boolean;

    @Prop()
    isFileTree: boolean;

    @Prop()
    errorTree: boolean;

    @Prop({ default: '' })
    externalCurrentPath: string;

    internalIsOpen: boolean = false;
    internalCurrentPath: string = '';

    created(): void {
        this.currentPath = this.externalCurrentPath + '/' + this.node.content.idNode;
        // this.internalIsOpen = this.isAllOpen || (this.hasChildren && this.isParentOfSelectedFile);
    }

    generateErrorTree(): void {
        this.$emit('generateErrorTree');
    }

    selectNewNode(path: string): void {
        if (this.selectionNumber === MSelectOption.SINGLE) {
            this.$emit('newNodeSelectected', path);
        }
    }

    openMe(): void {
        this.isOpen = true;
        this.$emit('openTheParent', true);
    }

    toggleChildrenVisibility(): void {
        this.isOpen = !this.isOpen;
    }

    isNodeSelected(): boolean {
        let isSelected: boolean = false;
        if (this.externalSelectedNode[0] === this.currentPath) {
            isSelected = true;
            this.$emit('openTheParent', true);
        }
        return isSelected;
    }

    // If my node can have children and is the parent of the selected file.
    // get isParentOfSelectedFile(): boolean {
    //     return this.externalSelectedNode[0] !== undefined && this.externalSelectedNode[0].indexOf(this.node.content.idNode) !== -1;
    // }

    validNode(): boolean {
        let isValid: boolean = true;
        if (this.node.content.idNode === undefined || !this.node.content.idNode) {
            isValid = false;
            this.generateErrorTree();
        }

        return isValid;
    }

    hasValidChildren(): boolean {
        return this.hasChildren && this.validNode();
    }

    get hasChildren(): boolean {
        return this.node.content.hasChildren !== undefined && this.node.content.hasChildren;
    }

    get childrenNotEmpty(): boolean {
        return this.node.children !== undefined && !!this.node.children.length;
    }

    get linkMode(): string {
        return this.isInactiveButton ? 'text' : 'button';
    }

    get isInactiveButton(): boolean {
        return this.selectionNumber === MSelectOption.NONE;
    }

    get nodeTitle(): string {
        return (this.node.content.elementLabel !== undefined && !!this.node.content.elementLabel) ? this.node.content.elementLabel : this.node.content.idNode;
    }

    get isOpen(): boolean {
        return this.internalIsOpen;
    }

    set isOpen(open: boolean) {
        this.internalIsOpen = open;
    }

    get currentPath(): string {
        return this.internalCurrentPath;
    }

    set currentPath(path: string) {
        this.internalCurrentPath = path;
    }

}

const TreeNodePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NODE_NAME, 'plugin.install');
        v.use(FileTreePlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
