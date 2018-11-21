import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { TREE_NODE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import TreeIconPlugin from '../tree-icon/tree-icon';
import { TreeNode } from '../tree/tree';
import WithRender from './tree-node.html?style=./tree-node.scss';

export enum MCheckboxState {
    Blank = '0',
    Half = '1',
    Checked = '2'
}
@WithRender
@Component
export class MTreeNode extends ModulVue {
    @Prop()
    public node: TreeNode;

    @Prop({ default: false })
    public open: boolean;

    @Prop({ default: [] })
    public selectedNodes: string[];

    @Prop()
    selectable: boolean;

    @Prop()
    public icons: boolean;

    @Prop({ default: '' })
    public path: string;

    @Prop()
    public placeholder: string;

    @Prop()
    public hasSibling: boolean;

    @Prop()
    public useExpandIcons: boolean;

    @Prop()
    public showCheckboxes: boolean;

    public internalOpen: boolean = false;

    public checkBoxState: string = MCheckboxState.Blank;

    private childrenCount: number = this.node.children ? this.node.children.length : 0;

    private selectedChildrenCount: number = 0;

    @Watch('isSelected')
    public watchCheckboxes(): void {
        if (this.showCheckboxes) {
            this.checkBoxState = this.isSelected ? MCheckboxState.Checked : MCheckboxState.Blank;
            this.$emit('childrenCheckboxStateChange', this.isSelected);
        }
    }

    // Updates parent's checkbox data
    public onChildrenCheckboxStateChange(childrenNodeSelected: boolean): void {
        this.selectedChildrenCount += childrenNodeSelected ? 1 : -1;
        if (this.isFolder) {
            this.updateFolderCheckboxState(this.selectedChildrenCount === this.childrenCount);
        }
    }

    public onClick(): void {
        if (this.isFolder) {
            this.internalOpen = !this.internalOpen;
            this.$emit('update:open', this.internalOpen);
        } else if (this.selectable) {
            this.$emit('click', this.currentPath);
        }
    }

    public onChildClick(path: string): void {
        this.$emit('click', path);
    }

    public childHasSibling(index: number): boolean {
        if (this.node.children) {
            return !!this.node.children[index + 1];
        }
        return false;
    }

    // Applies checkbox click to node. If node is a folder, updates each child's checkbox state
    public onCheckboxClick(): void {
        if (this.isFolder) {
            let childrenPaths: string[] = [];
            this.fetchSelectedChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id);
            this.updateSelectedNodes(childrenPaths);
        } else {
            this.onClick();
        }
    }

    // Sends children checkbox state to every parents. Half checkbox will affect all parents, blank will only affect parents with no children.
    public onFolderCheckboxStateUpdate(state: MCheckboxState): void {
        if (!this.isParentOfSelectedFile && state === MCheckboxState.Blank || state !== MCheckboxState.Blank) {
            this.checkBoxState = state;
        }
        this.$emit('folderCheckboxStateUpdate', state);
    }

    protected mounted(): void {
        this.internalOpen = this.open ? this.open : this.isParentOfSelectedFile;
    }

    // Adds or removes paths from the selectedNodes variable
    private updateSelectedNodes(childrenPaths: string[] = []): void {
        childrenPaths.forEach(path => {
            let nodeFound: boolean = this.selectedNodes.indexOf(path) !== -1;
            if (this.checkBoxState === MCheckboxState.Blank && !nodeFound) {
                this.selectedNodes.push(path);
            } else if (nodeFound) {
                this.selectedNodes.splice(this.selectedNodes.indexOf(path), 1);
            }
        });
    }

    // Recursive function that fetches the paths of a node selected children
    private fetchSelectedChildrenPaths(currentNode: TreeNode, childrenPath: string[], path: string): void {
        if (currentNode.children) {
            currentNode.children.forEach(child => {
                this.fetchSelectedChildrenPaths(child, childrenPath, path + '/' + child.id);
            });
        } else {
            childrenPath.push(path);
        }
    }

    // Updates unselectable folder checkbox according to the quantity of selected children
    private updateFolderCheckboxState(allChildrenSelected: boolean): void {
        if (allChildrenSelected) {
            this.checkBoxState = MCheckboxState.Checked;
            this.$emit('childrenCheckboxStateChange', true);
        } else if (this.selectedChildrenCount !== 0) {
            if (this.checkBoxState === MCheckboxState.Checked) {
                this.$emit('childrenCheckboxStateChange', false);
            }
            this.onFolderCheckboxStateUpdate(MCheckboxState.Half);
        } else {
            this.onFolderCheckboxStateUpdate(MCheckboxState.Blank);
        }
    }

    public get currentPath(): string {
        return this.path + '/' + this.node.id;
    }

    public get label(): string {
        return this.node.label || this.node.id;
    }

    private get isParentOfSelectedFile(): boolean {
        let pathMatchesSelectedNode: boolean = false;
        this.selectedNodes.forEach(selectedNode => {
            let reg: RegExp = new RegExp(`${this.currentPath}\/`);
            pathMatchesSelectedNode = reg.test(selectedNode) || pathMatchesSelectedNode;
        });
        return pathMatchesSelectedNode;
    }

    public get hasChildren(): boolean {
        return !!this.node.children && this.node.children.length > 0;
    }

    public get isFolder(): boolean {
        return this.node.hasChildren || !!this.node.children;
    }

    public get isDisabled(): boolean {
        return !this.selectable && !this.isFolder;
    }

    public get isSelected(): boolean {
        return this.selectedNodes.indexOf(this.currentPath) !== -1;
    }

    public get emptyContentMessage(): string {
        return this.placeholder || this.$i18n.translate('m-tree-node:empty');
    }
}

const TreeNodePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NODE_NAME, 'plugin.install');
        v.use(TreeIconPlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
