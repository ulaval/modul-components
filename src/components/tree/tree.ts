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
    externalSelectedNode: string[];

    @Prop({ default: false })
    isAllOpen: boolean;

    @Prop({ default: false })
    isFileTree: boolean;

    internalSelectedNode: string[] = [];
    internalErrorTree: boolean = false;

    emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');
    errorTreeTxt: string = this.$i18n.translate('m-tree:error');

    created(): void {
        this.selectedNode = this.externalSelectedNode ? this.externalSelectedNode : [];
    }

    mounted(): void {
        // Vérifier si le externalSelectedFile a été trouvé.
    }

    isTreeEmpty(): boolean {
        return !this.tree.length;
    }

    selectNewNode(path: string): void {
        this.selectedNode = [path];
        this.$emit('newNodeSelected', path);
    }

    generateErrorTree(): void {
        this.errorTree = true;
    }

    get selectedNode(): string[] {
        return this.internalSelectedNode;
    }

    set selectedNode(idNode: string[]) {
        this.internalSelectedNode = idNode;
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
