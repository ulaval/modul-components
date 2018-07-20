import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

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
    selectedNode: string[];

    @Prop()
    selectionIcon: string;

    @Prop()
    selectionQuantity: MSelectOption;

    @Prop()
    allOpen: boolean;

    @Prop()
    fileTree: boolean;

    @Prop({ default: '' })
    currentPath: string;

    emptyNodeTxt: string = this.$i18n.translate('m-tree-node:empty');

    private internalOpen: boolean = false;
    private internalCurrentPath: string = '';

    created(): void {
        this.propCurrentPath = this.currentPath + '/' + this.node.content.idNode;
        this.open = this.allOpen || (this.hasChildren && this.parentOfSelectedFile);
    }

    @Watch('allOpen')
    toggleAllOpen(): void {
        this.open = this.allOpen;
    }

    selectNewNode(path: string): void {
        if (this.selectionQuantity === MSelectOption.SINGLE) {
            this.$emit('newNodeSelectected', path);
        }
    }

    toggleChildrenVisibility(): void {
        this.open = !this.open;
    }

    selectedNodeFound(): void {
        this.$emit('selectedNodeFound');
    }

    nodeSelected(): boolean {
        let isSelected: boolean = false;
        if (this.selectedNode[0] !== undefined && this.selectedNode[0] === this.propCurrentPath) {
            isSelected = true;
            this.selectedNodeFound();
        }
        return isSelected;
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

    hasValidChildren(): boolean {
        return this.hasChildren && this.validNode();
    }

    get hasChildren(): boolean {
        return this.node.content.hasChildren !== undefined && this.node.content.hasChildren;
    }

    get nodeTitle(): string {
        return (this.node.content.elementLabel !== undefined && !!this.node.content.elementLabel) ? this.node.content.elementLabel : this.node.content.idNode;
    }

    get childrenNotEmpty(): boolean {
        return this.node.children !== undefined && !!this.node.children.length;
    }

    get typeLink(): string {
        return this.inactiveButton ? 'text' : 'button';
    }

    get inactiveButton(): boolean {
        return this.selectionQuantity === MSelectOption.NONE;
    }

    get open(): boolean {
        return this.internalOpen;
    }

    set open(open: boolean) {
        this.internalOpen = open;
    }

    get propCurrentPath(): string {
        return this.internalCurrentPath;
    }

    set propCurrentPath(path: string) {
        this.internalCurrentPath = path;
    }

    private get parentOfSelectedFile(): boolean {
        return this.selectedNode[0] !== undefined && this.selectedNode[0].indexOf(this.propCurrentPath) === 0;
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
