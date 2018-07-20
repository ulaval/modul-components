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
    selectionQuantity: MSelectOption;

    @Prop({ default: 'information' })
    selectionIcon: string;

    @Prop()
    selectedNode: string[];

    @Prop({ default: false })
    allOpen: boolean;

    @Prop({ default: false })
    fileTree: boolean;

    emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');
    errorTreeTxt: string = this.$i18n.translate('m-tree:error');
    errorSelectedNodeTxt: string = this.$i18n.translate('m-tree:selected-node-error');
    treeVisibilityTxt: string = '';

    private allOpenTxt: string = this.$i18n.translate('m-tree:all-close');
    private allCloseTxt: string = this.$i18n.translate('m-tree:all-open');
    private selectedNodeValid: boolean = false;
    private internalErrorTree: boolean = false;
    private internalSelectedNode: string[] = [];
    private internalAllOpen: boolean = false;

    created(): void {
        this.propSelectedNode = this.selectedNode ? this.selectedNode : [];
        this.selectedNodeValid = !this.propSelectedNode.length;
        this.propAllOpen = this.allOpen;
        this.setAllOpenTxt();
    }

    mounted(): void {
        if (!this.selectedNodeValid) {
            console.error(this.errorSelectedNodeTxt + ': ' + '\"' + this.propSelectedNode[0] + '\"');
        }
    }

    toggleAllVisibility(): void {
        this.propAllOpen = !this.propAllOpen;
        this.setAllOpenTxt();
    }

    treeEmpty(): boolean {
        return !this.tree.length;
    }

    selectNewNode(path: string): void {
        this.propSelectedNode = [path];
        this.$emit('newNodeSelected', path);
    }

    selectedNodeFound(): void {
        this.selectedNodeValid = true;
    }

    generateErrorTree(): void {
        this.errorTree = true;
    }

    setAllOpenTxt(): void {
        this.treeVisibilityTxt = this.propAllOpen ? this.allOpenTxt : this.allCloseTxt;
    }

    get propSelectedNode(): string[] {
        return this.internalSelectedNode;
    }

    set propSelectedNode(idNode: string[]) {
        this.internalSelectedNode = idNode;
    }

    get propAllOpen(): boolean {
        return this.internalAllOpen;
    }

    set propAllOpen(allOpen: boolean) {
        this.internalAllOpen = allOpen;
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
