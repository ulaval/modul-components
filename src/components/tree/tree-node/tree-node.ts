import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import I18nPlugin from '../../i18n/i18n';
import IconPlugin from '../../icon/icon';
import { TREE_NODE_NAME } from '../component-names';
import { TreeNode } from '../tree';
import TreeIconPlugin from '../tree-icon/tree-icon';
import WithRender from './tree-node.html?style=./tree-node.scss';
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
    public useAccordionIcons: boolean;

    @Prop()
    public withCheckboxes: boolean;

    @Prop()
    public parentSelectable: boolean;

    public selectedChildrenCount: number = 0;

    public internalOpen: boolean = false;

    @Watch('isSelected')
    public watchCheckboxes(): void {
        if (this.withCheckboxes) {
            this.$emit('child-checkbox-change', this.isSelected);
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

    public onChildCheckboxChange(selected: boolean): void {
        this.selectedChildrenCount += selected ? 1 : -1;
        let nodeFound: boolean = this.selectedParentNodes.indexOf(this.currentPath) !== -1;
        if (this.node.children && this.selectedChildrenCount === this.node.children.length && !nodeFound) {
            this.addNode(this.selectedParentNodes, this.currentPath);
            this.$emit('child-checkbox-change', true);
        } else if (nodeFound) {
            this.removeNode(this.selectedParentNodes, this.currentPath);
            this.$emit('child-checkbox-change', false);
        }
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
            this.fetchChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id);
            this.updateSelectedNodes(childrenPaths, !this.isSelectedParentNode);
        } else {
            this.onClick();
        }
    }

    protected mounted(): void {
        this.internalOpen = this.open ? this.open : this.isParentOfSelectedFile;
    }

    // Adds or removes paths from the selectedNodes
    private updateSelectedNodes(childrenPaths: string[] = [], addNode: boolean): void {
        childrenPaths.forEach(path => {
            let nodeFound: boolean = this.selectedNodes.indexOf(path) !== -1;
            if (addNode && !nodeFound) {
                this.addNode(this.selectedNodes, path);
            } else if (!addNode && nodeFound) {
                this.removeNode(this.selectedNodes, path);
            }
        });
    }

    private addNode(nodeArray: string[], path: string): void {
        nodeArray.push(path);
    }

    private removeNode(nodeArray: string[], path: string): void {
        nodeArray.splice(nodeArray.indexOf(path), 1);
    }

    // Recursive function that fetches children paths
    private fetchChildrenPaths(currentNode: TreeNode, childrenPath: string[], path: string): void {
        if (currentNode.children) {
            currentNode.children.forEach(child => {
                this.fetchChildrenPaths(child, childrenPath, path + '/' + child.id);
            });
        } else {
            childrenPath.push(path);
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
        return !this.selectable && !this.isFolder;
    }

    public get isSelected(): boolean {
        return this.selectedNodes.indexOf(this.currentPath) !== -1;
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
        v.use(I18nPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
