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

    private childrenCheckCount: number = this.node.children ? this.node.children.length : 0;

    @Watch('isSelected')
    public watchCheckboxes(): void {
        if (this.showCheckboxes) {
            this.$emit('checkboxChange');
        }
    }

    public onCheckboxChange(): void {
        this.$emit('checkboxChange');
    }

    public onClick(): void {
        if (this.isFolder) {
            this.internalOpen = !this.internalOpen;
            this.$emit('update:open', this.internalOpen);
        } else if (this.selectable) {
            this.$emit('click', this.currentPath);
        }
    }

    public onCheckboxClick(): void {
        let childrenPaths: string[] = [];
        if (this.isFolder) {
            this.selectChildrenNodes(this.node, childrenPaths, this.path + '/' + this.node.id);
            childrenPaths.forEach(path => {
                if (this.checkBoxState === MCheckboxState.Blank) {
                    if (this.selectedNodes.indexOf(path) === -1) {
                        this.selectedNodes.push(path);
                    }
                } else {
                    this.selectedNodes.splice(this.selectedNodes.indexOf(path), 1);
                }
            });
            this.checkBoxState = (this.checkBoxState === MCheckboxState.Blank) ? MCheckboxState.Checked : MCheckboxState.Blank;
        } else {
            this.onClick();
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

    protected mounted(): void {
        this.internalOpen = this.open ? this.open : this.isParentOfSelectedFile;
    }

    private selectChildrenNodes(currentNode: TreeNode, childrenPath: string[], path: string): void {
        if (currentNode.children) {
            currentNode.children.forEach(child => {
                this.selectChildrenNodes(child, childrenPath, path + '/' + child.id);
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
