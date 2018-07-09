import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import TreeNodePlugin from '../tree-node/tree-node';
import WithRender from './tree.html';

export interface TreeNode<T> {
    content: T;
    childs: TreeNode<T>[];
    // should be childs?: TreeNode<T>[]
}

export enum MSelectOption {
    NONE = '0',
    SINGLE = '1',
    MULTIPLE = '2'
}

@WithRender
@Component
export class MTree<T> extends ModulVue {

    @Prop()
    tree: TreeNode<T>[];

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    selection: MSelectOption;

    @Prop({ default: 'information' })
    selectionIcon: string;

    @Prop()
    externalSelectedNode: TreeNode<T>[];

    @Prop({ default: false })
    isAllOpen: boolean;

    @Prop({ default: false })
    isFileTree: boolean;

    internalSelectedNode: TreeNode<T>[] = [];
    emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');

    created(): void {
        this.selectedNode = this.externalSelectedNode ? this.externalSelectedNode : [];
    }

    isTreeEmpty(): boolean {
        return !this.tree.length;
    }

    selectNode(node: TreeNode<T>): void {
        this.selectedNode = [node];
        this.$emit('selectNode', node);
    }

    set selectedNode(node: TreeNode<T>[]) {
        this.internalSelectedNode = node;
    }

    get selectedNode(): TreeNode<T>[] {
        return this.internalSelectedNode;
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
