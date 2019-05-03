import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { TREE_ICON_NAME } from '../../component-names';
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
    public readonly: boolean;

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
            if (!this.hasChildren || this.isParentAutoSelect) {
                this.$emit('auto-select-child-checkbox-change', this.isSelected);
            } else if (this.isButtonAutoSelect && this.hasChildren) {
                this.onAutoSelectChildCheckboxChange(this.isSelected, true);
            }
        }
    }

    protected mounted(): void {
        this.internalOpen = this.open || this.isParentOfOpenedFolder() || this.isParentOfSelectedFile;
        if (this.isSelected) {
            this.notifyParentOfChildCheckboxState();
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

    @Emit('click')
    public onChildClick(path: string): string {
        return path;
    }

    public onAutoSelectButtonClick(): void {
        this.recursiveSelect();
    }

    public onAutoSelectChildCheckboxChange(selected: boolean, ignoreCount: boolean = false): void {
        if (!ignoreCount) {
            this.selectedChildrenCount += selected ? 1 : -1;
        }
        let allChildrenSelected: boolean = this.selectedChildrenCount === (this.node.children ? this.node.children.length : -1);

        if (this.isCheckboxAutoSelect || (this.isParentAutoSelect && !selected)) { // Parent checkbox mode does not select parent by itself
            this.updateCheckboxParentNode(allChildrenSelected);
        } else if (this.isButtonAutoSelect) {
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
        if (this.hasChildren && (this.isCheckboxAutoSelect || this.isParentAutoSelect)) {
            this.recursiveSelect();
        } else {
            this.$emit('click', this.currentPath);
        }
    }

    private recursiveSelect(): void {
        let childrenPaths: string[] = [];
        let addNodesToSelected: boolean = false;

        if (this.isButtonAutoSelect) {
            childrenPaths.concat(this.currentPath);
            if (!this.allChildrenAndSelfSelected) {
                addNodesToSelected = true;
            }
        } else if (!this.isButtonAutoSelect && !this.isSelected) {
            addNodesToSelected = true;
        }

        this.fetchChildrenPaths(this.node, childrenPaths, this.path + '/' + this.node.id, (this.isParentAutoSelect || this.isButtonAutoSelect));
        this.updateSelectedNodes(childrenPaths, addNodesToSelected);
    }

    private updateSelectedNodes(paths: string[] = [], addNodesToSelected: boolean): void {
        paths = Array.from(new Set(paths));
        paths.forEach(path => {
            let nodeAlreadySelected: boolean = this.selectedNodes.indexOf(path) !== -1;
            if ((addNodesToSelected && !nodeAlreadySelected) || (!addNodesToSelected && nodeAlreadySelected)) { // Prevent nodes to be pushed twice or unselected nodes to be removed
                this.$emit('click', path);
            }
        });
    }

    private fetchChildrenPaths(currentNode: TreeNode, childrenPath: string[], path: string, includeParent: boolean = false): void {
        if (currentNode.children && currentNode.children.length > 0) {
            currentNode.children.forEach(child => {
                this.fetchChildrenPaths(child, childrenPath, path + '/' + child.id, includeParent);
            });
            if (includeParent) {
                childrenPath.push(path);
            }
        } else {
            childrenPath.push(path);
        }
    }

    private isParentOfOpenedFolder(currentNode: TreeNode = this.node): boolean {
        let found: boolean = false;
        if (currentNode.children && currentNode.children.length > 0) {
            currentNode.children.forEach(child => {
                if (child.children && child.children.length > 0) {
                    if (child.open) {
                        found = true;
                    } else {
                        found = this.isParentOfOpenedFolder(child);
                    }
                }
            });
        }
        return found;
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

    public get isDisabled(): boolean {
        let isDisabled: boolean = false;
        let inDisabledNodes: boolean = this.disabledNodes && this.disabledNodes.indexOf(this.currentPath) !== -1;
        if (!this.selectable && !this.isFolder && !this.readonly || inDisabledNodes && !this.readonly) {
            isDisabled = true;
        }
        return isDisabled;
    }

    public get isReadonlyStyle(): boolean {
        let isReadonly: boolean = false;
        if (!this.selectable && this.readonly) {
            isReadonly = true;
        }
        return isReadonly;
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

    public get hasChildren(): boolean {
        return !!this.node.children && this.node.children.length > 0;
    }

    public get isFolder(): boolean {
        return this.node.hasChildren || !!this.node.children;
    }

    public get isSelected(): boolean {
        return this.selectedNodes.indexOf(this.currentPath) !== -1;
    }

    public get isIndeterminate(): boolean {
        return (this.isCheckboxAutoSelect || this.isParentAutoSelect) && this.isParentOfSelectedFile && !this.isSelected;
    }

    public get emptyContentMessage(): string {
        return this.placeholder || this.$i18n.translate('m-tree-node:empty');
    }

    public get withCheckboxes(): boolean {
        return this.checkboxes !== MCheckboxes.False;
    }

    private get isParentAutoSelect(): boolean {
        return this.checkboxes === MCheckboxes.WithParentAutoSelect;
    }

    private get isButtonAutoSelect(): boolean {
        return this.checkboxes === MCheckboxes.WithButtonAutoSelect;
    }

    private get isCheckboxAutoSelect(): boolean {
        return this.checkboxes === MCheckboxes.WithCheckboxAutoSelect;
    }

    private get hasRightIcon(): boolean {
        return this.withCheckboxes && !!this.node.rightIconName;
    }
}
