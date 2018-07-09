import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import FileTreePlugin from '../file-tree/file-tree';
import IconPlugin from '../icon/icon';
import { MSelectOption, TreeNode } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

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

    @Prop({ default: false })
    isFile: boolean;

    internalIsOpen: boolean = false;

    created(): void {
        this.internalIsOpen = !this.node.content['idNode'] && this.externalSelectedNode[0].content['elementPath'].indexOf(this.node.content['elementPath']) !== -1;
    }

    hasChild(idNode: string): boolean {
        return !idNode;
    }

    isDisabled(): boolean {
        return !this.node.childs.length;
    }

    isNodeSelected(node: TreeNode<T>): boolean {
        return !!this.externalSelectedNode.length && !!node.content['idNode'] && this.externalSelectedNode[0].content['idNode'] === node.content['idNode'];
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
        }
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
