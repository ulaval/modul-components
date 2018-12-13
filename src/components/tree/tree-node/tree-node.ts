import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import CheckboxPlugin from '../../checkbox/checkbox';
import I18nPlugin from '../../i18n/i18n';
import { TREE_ICON_NAME, TREE_NODE_NAME } from '../component-names';
import { MCheckboxes, TreeNode } from '../tree';
import { MTreeIcon } from '../tree-icon/tree-icon';
import WithRender from './tree-node.html?style=./tree-node.scss';

@WithRender
@Component({
    components: {
        [TREE_ICON_NAME]: MTreeIcon
    }
})
export class MTreeNode extends ModulVue {
    @Prop()
    public node: TreeNode;

    @Prop({ default: false })
    public open: boolean;

    @Prop({ default: [] })
    public selectedNodes: string[];

    @Prop()
    public checkboxes: MCheckboxes;

    @Prop()
    public selectable: boolean;

    @Prop()
    public useFilesIcons: boolean;

    @Prop({ default: '' })
    public path: string;

    @Prop()
    public placeholder: string;

    @Prop()
    public hasSibling: boolean;

    @Prop()
    public disabledNodes: string[];

    public internalOpen: boolean = false;

    public allChildrenAndSelfSelected: boolean = false;

    private selectedChildrenCount: number = 0;

    @Watch('isSelected')
    public notifyParentOfChildCheckboxState(): void {
        if (this.withCheckboxes) {
            let isCheckboxParentAutoSelect: boolean = this.validateAutoSelectMode([MCheckboxes.WithParentAutoSelect]);
            let isCheckboxButtonAutoSelect: boolean = this.validateAutoSelectMode([MCheckboxes.WithButtonAutoSelect]);

            if (!this.hasChildren || isCheckboxParentAutoSelect) {
                this.$emit('auto-select-child-checkbox-change', this.isSelected);
            } else if (isCheckboxButtonAutoSelect && this.hasChildren) {
                this.onAutoSelectChildCheckboxChange(this.isSelected, true);
            }
        }
    }

    public onClick(): void {
        if (this.isFolder) {
            this.internalOpen = !this.internalOpen;
            this.$emit('update:open', this.internalOpen);
        } else if (this.selectable && !this.withCheckboxes) { // Clicks are emitted from checkboxes when true
            this.$emit('click', this.currentPath);
        }
    }

    @Emit('click')
    public onChildClick(path: string): string {
        return path;
    }

    public onAutoSelectButtonClick(): void {
        let childrenPaths: string[] = [];
        this.fetchChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id, true);
        this.updateSelectedNodes(childrenPaths.concat(this.currentPath), !this.allChildrenAndSelfSelected);
    }

    public onAutoSelectChildCheckboxChange(selected: boolean, ignoreCount: boolean = false): void {
        if (!ignoreCount) {
            this.selectedChildrenCount += selected ? 1 : -1;
        }
        let allChildrenSelected: boolean = this.selectedChildrenCount === (this.node.children ? this.node.children.length : -1);
        let isCheckboxAutoselect: boolean = this.validateAutoSelectMode([MCheckboxes.WithCheckboxAutoSelect]);
        let isParentCheckboxAutoselect: boolean = this.validateAutoSelectMode([MCheckboxes.WithParentAutoSelect]);

        if (isCheckboxAutoselect || (isParentCheckboxAutoselect && !selected)) { // Parent checkbox mode does not select parent by itself
            this.updateCheckboxParentNode(allChildrenSelected);
        } else if (!isParentCheckboxAutoselect) {
            this.updateButtonParentNode(allChildrenSelected, selected);
        }

    }

    public childHasSibling(index: number): boolean {
        if (this.node.children) {
            return !!this.node.children[index + 1];
        }
        return false;
    }

    public onCheckboxClick(): void {
        let isCheckboxAutoselect: boolean = this.validateAutoSelectMode([MCheckboxes.WithCheckboxAutoSelect, MCheckboxes.WithParentAutoSelect]);
        let isParentCheckboxAutoselect: boolean = this.validateAutoSelectMode([MCheckboxes.WithParentAutoSelect]);

        if (this.hasChildren && isCheckboxAutoselect) {
            let childrenPaths: string[] = [];
            this.fetchChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id, isParentCheckboxAutoselect);
            this.updateSelectedNodes(childrenPaths, !this.isSelected);
        } else {
            this.$emit('click', this.currentPath);
        }
    }

    public updateSelectedNodes(paths: string[] = [], addNode: boolean): void {
        paths = Array.from(new Set(paths));
        paths.forEach(path => {
            let nodeAlreadySelected: boolean = this.selectedNodes.indexOf(path) !== -1;
            if ((addNode && !nodeAlreadySelected) || (!addNode && nodeAlreadySelected)) {
                this.$emit('click', path);
            }
        });
    }

    protected mounted(): void {
        this.internalOpen = this.open ? this.open : this.isParentOfSelectedFile;
        if (this.isSelected) {
            this.notifyParentOfChildCheckboxState();
        }
    }

    private fetchChildrenPaths(currentNode: TreeNode, childrenPath: string[], path: string, addFolder: boolean = false): void {
        if (currentNode.children && currentNode.children.length > 0) {
            currentNode.children.forEach(child => {
                this.fetchChildrenPaths(child, childrenPath, path + '/' + child.id, addFolder);
            });
            if (addFolder) {
                childrenPath.push(path);
            }
        } else {
            childrenPath.push(path);
        }
    }

    private updateCheckboxParentNode(allChildrenSelected: boolean): void {
        if (allChildrenSelected && !this.isSelected) {
            this.$emit('click', this.currentPath); // Auto-push current, emit to parent for recursivity
            this.$emit('auto-select-child-checkbox-change', true);
        } else if (this.isSelected) {
            this.$emit('click', this.currentPath);
            this.$emit('auto-select-child-checkbox-change', false); // Not all children are selected, stop recursivity
        }
    }

    private updateButtonParentNode(allChildrenSelected: boolean, selected: boolean): void {
        if (allChildrenSelected && selected && this.isSelected) { // New element selected was added, current and all children are selected
            this.allChildrenAndSelfSelected = true;
            this.$emit('auto-select-child-checkbox-change', true); // Notifies immidiate parent's button that current button is on
        } else if (this.allChildrenAndSelfSelected) { // Button was on, but something was removed.
            this.allChildrenAndSelfSelected = false;
            this.$emit('auto-select-child-checkbox-change', false); // Something was removed so every parent buttons must know
        }
    }

    private validateAutoSelectMode(modes: string[]): boolean {
        let isValid: boolean = false;
        modes.forEach(mode => {
            if (mode === this.checkboxes) {
                isValid = true;
            }
        });

        return isValid;
    }

    public get currentPath(): string {
        return this.path + '/' + this.node.id;
    }

    public get label(): string {
        return this.node.label || this.node.id;
    }

    public get propCheckboxes(): MCheckboxes {
        return this.checkboxes || MCheckboxes.False;
    }

    public get moveSelectionZoneToCheckbox(): boolean {
        return this.withCheckboxes && !this.isFolder;
    }

    public get displaySelectionButton(): boolean {
        return this.hasChildren && this.checkboxes === MCheckboxes.WithButtonAutoSelect;
    }

    public get isParentOfSelectedFile(): boolean {
        let pathMatchesSelectedNode: boolean = false;
        this.selectedNodes.forEach(selectedNode => {
            let parentPath: string = this.currentPath + '/';
            if (selectedNode.indexOf(parentPath) !== -1) {
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
        let inDisabledNodes: boolean = this.disabledNodes && this.disabledNodes.indexOf(this.currentPath) !== -1;
        if (!this.selectable && !this.isFolder || inDisabledNodes) {
            isDisabled = true;
        }
        return isDisabled;
    }

    public get isSelected(): boolean {
        return this.selectedNodes.indexOf(this.currentPath) !== -1;
    }

    public get isIndeterminate(): boolean {
        let autoSelectCheckboxes: boolean = this.validateAutoSelectMode([MCheckboxes.WithCheckboxAutoSelect, MCheckboxes.WithParentAutoSelect]);
        return autoSelectCheckboxes && this.isParentOfSelectedFile && !this.isSelected;
    }

    public get emptyContentMessage(): string {
        return this.placeholder || this.$i18n.translate('m-tree-node:empty');
    }

    public get withCheckboxes(): boolean {
        return this.checkboxes !== MCheckboxes.False;
    }

}

const TreeNodePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NODE_NAME, 'plugin.install');
        v.use(CheckboxPlugin);
        v.use(I18nPlugin);
        v.component(TREE_NODE_NAME, MTreeNode);
    }
};

export default TreeNodePlugin;
