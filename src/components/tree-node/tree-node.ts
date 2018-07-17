import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import FileTreePlugin from '../file-tree/file-tree';
import IconPlugin from '../icon/icon';
import { MSelectOption, MTreeFormat, TreeNode } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

@WithRender
@Component
export class MTreeNode<T extends MTreeFormat> extends ModulVue {

    @Prop()
    node: TreeNode<MTreeFormat>;

    @Prop()
    externalSelectedNode: TreeNode<MTreeFormat>[];

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

    internalIsOpen: boolean = false;

    created(): void {
        this.internalIsOpen = this.isAllOpen || (this.hasChildren && this.isParentOfSelectedFile);
    }

    validNode(): boolean {
        let valid: boolean = true;
        if (this.node.content.idNode === undefined || !this.node.content.idNode) {
            valid = false;
            this.generateErrorTree();
        }

        return valid;
    }

    generateErrorTree(): void {
        this.$emit('generateErrorTree');
    }

    selectNewNode(node: TreeNode<T>): void {
        if (this.selectionNumber === MSelectOption.SINGLE) {
            this.$emit('newNodeSelectected', node);
        }
    }

    toggleChildrenVisibility(): void {
        if (!this.hasNoChild) {
            this.internalIsOpen = !this.isOpen;
        }
    }

    isNodeSelected(): boolean {
        return !!this.externalSelectedNode.length && this.externalSelectedNode[0].content.idNode === this.node.content.idNode;
    }

    // If my node can have children and is the parent of the selected file.
    get isParentOfSelectedFile(): boolean {
        return this.externalSelectedNode[0] !== undefined && this.externalSelectedNode[0].content.elementPath.indexOf(this.node.content.elementPath) !== -1;
    }

    get hasValidChildren(): boolean {
        return this.hasChildren && this.validNode();
    }

    get hasChildren(): boolean {
        return this.node.content.hasChildren !== undefined && this.node.content.hasChildren;
    }

    // If a node can have children but don't
    get hasNoChild(): boolean {
        return this.node.children === undefined || !this.node.children.length;
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
        return this.internalIsOpen && !this.hasNoChild;
    }

}

const TreeNodePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NODE_NAME, 'plugin.install');
        v.use(FileTreePlugin);
        v.use(IconPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
