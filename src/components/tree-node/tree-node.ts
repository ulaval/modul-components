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
    public node: TreeNode<MTreeFormat>;

    @Prop()
    public selectedNodes: string[];

    @Prop()
    public selectionIcon: string;

    @Prop()
    public selectionQuantity: MSelectOption;

    @Prop()
    public allOpen: boolean;

    @Prop()
    public fileTree: boolean;

    @Prop({ default: '' })
    public currentPath: string;

    private internalOpen: boolean = false;
    private internalCurrentPath: string = '';

    public selectNewNode(path: string): void {
        if (this.selectionQuantity === MSelectOption.SINGLE) {
            this.$emit('newNodeSelectected', path);
        }
    }

    public toggleChildrenVisibility(): void {
        this.open = !this.open;
    }

    public selectedNodeFound(): void {
        this.$emit('selectedNodesFound');
    }

    public nodeSelected(): boolean {
        let isSelected: boolean = false;
        if (this.selectedNodes[0] !== undefined && this.selectedNodes[0] === this.propCurrentPath) {
            isSelected = true;
            this.selectedNodeFound();
        }
        return isSelected;
    }

    public validNode(): boolean {
        let valid: boolean = true;
        if (this.node.content.nodeId === undefined || !this.node.content.nodeId) {
            valid = false;
            this.generateErrorTree();
        }

        return valid;
    }

    public generateErrorTree(): void {
        this.$emit('generateErrorTree');
    }

    public hasValidChildren(): boolean {
        return this.hasChildren && this.validNode();
    }

    protected created(): void {
        this.propCurrentPath = this.currentPath + '/' + this.node.content.nodeId;
        this.open = this.allOpen || (this.hasChildren && this.parentOfSelectedFile);
    }

    @Watch('allOpen')
    private toggleAllOpen(): void {
        this.open = this.allOpen;
    }

    public get nodeTitle(): string {
        return (this.node.content.nodeLabel !== undefined && !!this.node.content.nodeLabel) ? this.node.content.nodeLabel : this.node.content.nodeId;
    }

    public get childrenNotEmpty(): boolean {
        return this.node.children !== undefined && !!this.node.children.length;
    }

    public get typeLink(): string {
        return this.inactiveButton ? 'text' : 'button';
    }

    public get inactiveButton(): boolean {
        return this.selectionQuantity === MSelectOption.NONE;
    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(open: boolean) {
        this.internalOpen = open;
    }

    public get propCurrentPath(): string {
        return this.internalCurrentPath;
    }

    public set propCurrentPath(path: string) {
        this.internalCurrentPath = path;
    }

    private get hasChildren(): boolean {
        return this.node.content.hasChildren !== undefined && this.node.content.hasChildren;
    }

    private get parentOfSelectedFile(): boolean {
        return this.selectedNodes[0] !== undefined && this.selectedNodes[0].indexOf(this.propCurrentPath) === 0;
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
