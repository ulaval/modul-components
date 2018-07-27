import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import TreeNodePlugin from '../tree-node/tree-node';
import WithRender from './tree.html?style=./tree.scss';

export interface MTreeFormat {
    nodeId: string;
    nodeLabel?: string;
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
    public tree: TreeNode<MTreeFormat>[];

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    public selectionQuantity: MSelectOption;

    @Prop({ default: 'information' })
    public selectionIcon: string;

    @Prop()
    public selectedNode: string[];

    @Prop({ default: false })
    public allOpen: boolean;

    @Prop({ default: false })
    public fileTree: boolean;

    public emptyTreeTxt: string = this.$i18n.translate('m-tree:empty');
    public errorTreeTxt: string = this.$i18n.translate('m-tree:error');
    public treeVisibilityTxt: string = '';

    private allOpenTxt: string = this.$i18n.translate('m-tree:all-close');
    private allCloseTxt: string = this.$i18n.translate('m-tree:all-open');
    private selectedNodeValid: boolean = false;
    private internalErrorTree: boolean = false;
    private internalSelectedNode: string[] = [];
    private internalAllOpen: boolean = false;

    public toggleAllVisibility(): void {
        this.propAllOpen = !this.propAllOpen;
        this.setAllOpenTxt();
    }

    public selectNewNode(path: string): void {
        this.propSelectedNode = [path];
        this.$emit('newNodeSelected', path);
    }

    public selectedNodeFound(): void {
        this.selectedNodeValid = true;
    }

    public generateErrorTree(): void {
        this.errorTree = true;
    }

    protected created(): void {
        this.propSelectedNode = this.selectedNode ? this.selectedNode : [];
        this.selectedNodeValid = !this.propSelectedNode.length;
        this.propAllOpen = this.allOpen;
        this.setAllOpenTxt();
    }

    protected mounted(): void {
        if (!this.selectedNodeValid) {
            console.error(`modUL - The selected node was not found: ` + '\"' + this.propSelectedNode[0] + '\"');
        }
    }

    private setAllOpenTxt(): void {
        this.treeVisibilityTxt = this.propAllOpen ? this.allOpenTxt : this.allCloseTxt;
    }

    public get propTreeEmpty(): boolean {
        return !this.tree.length;
    }

    public get propSelectedNode(): string[] {
        return this.internalSelectedNode;
    }

    public set propSelectedNode(nodeId: string[]) {
        this.internalSelectedNode = nodeId;
    }

    public get propAllOpen(): boolean {
        return this.internalAllOpen;
    }

    public set propAllOpen(allOpen: boolean) {
        this.internalAllOpen = allOpen;
    }

    public get errorTree(): boolean {
        return this.internalErrorTree;
    }

    public set errorTree(error: boolean) {
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
