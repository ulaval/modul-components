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
    node: TreeNode<T>;

    @Prop()
    externalSelectedNode: TreeNode<T>[];

    @Prop()
    selectionIcon: string;

    @Prop()
    selectionNumber: MSelectOption;

    @Prop()
    isAllOpen: boolean;

    @Prop()
    isFileTree: boolean;

    internalIsOpen: boolean = false;

    created(): void {
        this.internalIsOpen = this.isAllOpen || (this.canHaveChildren && this.externalSelectedNode[0].content.elementPath.indexOf(this.node.content.elementPath) !== -1);
    }

    selectNewNode(node: TreeNode<T>): void {
        if (this.selectionNumber !== MSelectOption.MULTIPLE) {
            this.$emit('selectNewNode', node);
        }
    }

    toggleChildren(): void {
        if (!this.hasChildren) {
            this.isOpen = !this.isOpen;
        }
    }

    isNodeSelected(): boolean {
        return !this.canHaveChildren && !!this.externalSelectedNode.length && this.externalSelectedNode[0].content.idNode === this.node.content.idNode;
    }

    // If a node can have children but don't
    get hasChildren(): boolean {
        return this.node.children === undefined || !this.node.children.length;
    }

    // A node without an id, can have children.
    get canHaveChildren(): boolean {
        return !this.node.content.idNode;
    }

    get linkMode(): string {
        return this.isInactiveButton ? 'text' : 'button';
    }

    get isInactiveButton(): boolean {
        return this.selectionNumber === MSelectOption.NONE;
    }

    get nodeTitle(): string {
        return this.node.content.elementLabel;
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
        v.use(FileTreePlugin);
        v.use(IconPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
