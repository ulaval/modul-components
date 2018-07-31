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
export class MTreeNode extends ModulVue {

    @Prop()
    public node: TreeNode<MTreeFormat>;

    @Prop({ default: [] })
    public selectedNodes: string[];

    @Prop({ default: () => { return MSelectOption.NONE; },
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    public selectionQuantity: MSelectOption;

    @Prop({ default: '' })
    public selectionIcon: string;

    @Prop({ default: false })
    public allOpen: boolean;

    @Prop({ default: false })
    public fileTree: boolean;

    @Prop({ default: '' })
    public currentPath: string;

    private internalOpen: boolean = false;
    private internalCurrentPath: string = '';

    public test(): MSelectOption {
        return MSelectOption.NONE;
    }

    public selectNewNode(path: string): void {
        if (this.selectionQuantity === MSelectOption.SINGLE) {
            this.$emit('newNodeSelectected', path);
        }
    }

    public toggleChildrenVisibility(): void {
        this.open = !this.open;
    }

    public selectedNodeFound(): void {
        this.$emit('selectedNodeFound');
    }

    public generateErrorTree(): void {
        this.$emit('generateErrorTree');
    }

    @Watch('allOpen')
    public toggleAllOpen(): void {
        this.open = this.allOpen;
    }

    protected created(): void {
        this.propCurrentPath = this.currentPath + '/' + this.node.content.nodeId;
        this.open = this.allOpen || (this.hasChildren && this.parentOfSelectedFile);
    }

    public get nodeSelected(): boolean {
        let isSelected: boolean = false;
        if (this.selected) {
            isSelected = true;
            this.selectedNodeFound();
        }
        return isSelected;
    }

    public get selectedIcon(): boolean {
        return this.selected && !!this.selectionIcon;
    }

    public get validNode(): boolean {
        let valid: boolean = true;
        if (this.node.content.nodeId === undefined || !this.node.content.nodeId) {
            valid = false;
            this.generateErrorTree();
        }

        return valid;
    }

    public get nodeTitle(): string {
        return (this.node.content.nodeLabel !== undefined && !!this.node.content.nodeLabel) ? this.node.content.nodeLabel : this.node.content.nodeId;
    }

    public get hasValidChildren(): boolean {
        return this.hasChildren && this.validNode;
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

    private get selected(): boolean {
        return this.selectedNodes[0] !== undefined && this.selectedNodes[0] === this.propCurrentPath;
    }

    private get hasChildren(): boolean {
        return (this.node.children !== undefined && !!this.node.children.length) || (this.node.content.hasChildren !== undefined && this.node.content.hasChildren);
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
