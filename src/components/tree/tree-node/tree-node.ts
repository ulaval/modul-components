import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import CheckboxPlugin from '../../checkbox/checkbox';
import I18nPlugin from '../../i18n/i18n';
import IconPlugin from '../../icon/icon';
import { TREE_NODE_NAME } from '../component-names';
import { TreeNode } from '../tree';
import TreeIconPlugin from '../tree-icon/tree-icon';
import WithRender from './tree-node.html?style=./tree-node.scss';

export enum MAutoSelectCheckboxesMode {
    None = '0',
    Checkbox = '1',
    Button = '2'
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

    @Prop({ default: [] })
    public selectedParentNodes: string[];

    @Prop({
        default: MAutoSelectCheckboxesMode.Checkbox,
        validator: value =>
            value === MAutoSelectCheckboxesMode.None ||
            value === MAutoSelectCheckboxesMode.Checkbox ||
            value === MAutoSelectCheckboxesMode.Button
    })
    public autoSelectCheckboxesMode: MAutoSelectCheckboxesMode;

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
    public usePlusIcons: boolean;

    @Prop()
    public withCheckboxes: boolean;

    @Prop()
    public disabledNodes: string[];

    public selectedChildrenCount: number = 0;

    public internalOpen: boolean = false;

    @Watch('isSelected')
    public watchCheckboxes(): void {
        if (this.withCheckboxes && this.autoSelectCheckboxesMode === MAutoSelectCheckboxesMode.Checkbox) {
            this.$emit('auto-select-child-checkbox-change', this.isSelected);
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

    public onChildClick(path: string, fromCheckbox: boolean = false): void {
        this.$emit('click', path, fromCheckbox);
    }

    // When auto-select is on, isSelected is watched and this function is called to keep track of parent's state
    public onAutoSelectChildCheckboxChange(selected: boolean): void {
        this.selectedChildrenCount += selected ? 1 : -1;
        let nodeAlreadySelected: boolean = this.selectedParentNodes.indexOf(this.currentPath) !== -1;
        if (this.node.children && this.selectedChildrenCount === this.node.children.length && !nodeAlreadySelected) {
            this.addNode(this.selectedParentNodes, this.currentPath);
            this.$emit('auto-select-child-checkbox-change', true);
        } else if (nodeAlreadySelected) {
            this.removeNode(this.selectedParentNodes, this.currentPath);
            this.$emit('auto-select-child-checkbox-change', false);
        }
    }

    public childHasSibling(index: number): boolean {
        if (this.node.children) {
            return !!this.node.children[index + 1];
        }
        return false;
    }

    public onCheckboxClick(): void {
        if (this.isFolder && this.autoSelectCheckboxesMode !== MAutoSelectCheckboxesMode.None) {
            let childrenPaths: string[] = [];
            this.fetchChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id);
            this.updateSelectedNodes(childrenPaths, !this.isSelectedParentNode);
        } else {
            this.$emit('click', this.currentPath, true);
        }
    }

    protected mounted(): void {
        this.internalOpen = this.open ? this.open : this.isParentOfSelectedFile;
    }

    // Push or splice nodes in paths array
    private updateSelectedNodes(paths: string[] = [], addNode: boolean): void {
        paths.forEach(path => {
            let nodeAlreadySelected: boolean = this.selectedNodes.indexOf(path) !== -1;
            if (addNode && !nodeAlreadySelected) {
                this.addNode(this.selectedNodes, path);
            } else if (!addNode && nodeAlreadySelected) {
                this.removeNode(this.selectedNodes, path);
            }
        });
    }

    // Fetches every node under current parent
    private fetchChildrenPaths(currentNode: TreeNode, childrenPath: string[], path: string): void {
        if (currentNode.children && currentNode.children.length > 0) {
            currentNode.children.forEach(child => {
                this.fetchChildrenPaths(child, childrenPath, path + '/' + child.id);
            });
        } else {
            childrenPath.push(path);
        }
    }

    // Push node to given array
    private addNode(nodeArray: string[], path: string): void {
        if (!this.pathIsDisabled(path)) {
            nodeArray.push(path);
        }
    }

    // Remove node from given array
    private removeNode(nodeArray: string[], path: string): void {
        nodeArray.splice(nodeArray.indexOf(path), 1);
    }

    private pathIsDisabled(path: string): boolean {
        return this.disabledNodes && this.disabledNodes.indexOf(path) !== -1;
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
            if (reg.test(selectedNode) || pathMatchesSelectedNode) {
                pathMatchesSelectedNode = true;
            }
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
        let isDisabled: boolean = false;
        if (!this.selectable && !this.isFolder || (this.disabledNodes && this.disabledNodes.indexOf(this.currentPath) !== -1)) {
            isDisabled = true;
        }

        return isDisabled;
    }

    public get isSelected(): boolean {
        return this.selectedNodes.indexOf(this.currentPath) !== -1;
    }

    // Partial checkbox selection state
    public get isIndeterminated(): boolean {
        return this.isParentOfSelectedFile && !this.isSelectedParentNode && this.autoSelectCheckboxesMode === MAutoSelectCheckboxesMode.Checkbox;
    }

    public get isSelectedParentNode(): boolean {
        return this.selectedParentNodes.indexOf(this.currentPath) !== -1;
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
        v.use(CheckboxPlugin);
        v.use(I18nPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
