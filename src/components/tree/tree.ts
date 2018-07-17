import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import TreeNodePlugin from '../tree-node/tree-node';
import WithRender from './tree.html?style=./tree.scss';

export interface MTreeFormat {
    idNode: string;
    elementLabel?: string;
    elementPath: string;
    hasChildren?: boolean;
}

export interface TreeNode<T extends MTreeFormat> {
    content: T;
    children?: TreeNode<T>[];
}

export enum MSelectOption {
    NONE = '0',
    SINGLE = '1',
    MULTIPLE = '2'
}

@WithRender
@Component
export class MTree<T extends MTreeFormat> extends ModulVue {

    @Prop()
    tree: TreeNode<MTreeFormat>[];

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    selectionNumber: MSelectOption;

    @Prop({ default: 'information' })
    selectionIcon: string;

    @Prop()
    externalSelectedNode: TreeNode<MTreeFormat>[];

    @Prop({ default: false })
    isAllOpen: boolean;

    @Prop({ default: false })
    isFileTree: boolean;

    internalSelectedNode: TreeNode<MTreeFormat>[] = [];
    internalErrorTree: boolean = false;

    emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');
    errorTreeTxt: string = this.$i18n.translate('m-tree:error');

    created(): void {
        this.selectedNode = this.externalSelectedNode ? this.externalSelectedNode : [];
    }

    isTreeEmpty(): boolean {
        return !this.tree.length;
    }

    selectNewNode(node: TreeNode<T>): void {
        this.selectedNode = [node];
        this.$emit('newNodeSelected', node);
    }

    generateErrorTree(): void {
        this.errorTree = true;
    }

    get selectedNode(): TreeNode<MTreeFormat>[] {
        return this.internalSelectedNode;
    }

    set selectedNode(node: TreeNode<MTreeFormat>[]) {
        this.internalSelectedNode = node;
    }

    get errorTree(): boolean {
        return this.internalErrorTree;
    }

    set errorTree(error: boolean) {
        this.internalErrorTree = error;
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
