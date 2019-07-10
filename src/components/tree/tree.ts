import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import CheckboxPlugin from '../checkbox/checkbox';
import { TREE_ICON_NAME, TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import MessagePlugin from '../message/message';
import PlusPlugin from '../plus/plus';
import AccordionTransitionPlugin from '../transitions/accordion-transition/accordion-transition';
import { TREE_NODE_NAME } from './component-names';
import { MTreeIcon } from './tree-icon/tree-icon';
import { MTreeNode } from './tree-node/tree-node';
import WithRender from './tree.html?style=./tree.scss';
export interface TreeNode {
    id: string;
    label?: string;
    open?: boolean;
    children?: TreeNode[];
    hasChildren?: boolean;
    data?: any;
    rightIconName?: string;
}

export enum MSelectionMode {
    None = 'none',
    Single = 'single',
    Multiple = 'multiple',
    Readonly = 'readonly'
}

export enum MCheckboxes {
    True = 'true', // Fully independant checkbox selection
    False = 'false', // No Checkboxes
    WithButtonAutoSelect = 'with-button-auto-select', // Fully independat, but a button can handle mass-selection
    WithCheckboxAutoSelect = 'with-checkbox-auto-select', // Selection of parents is 100% related to children
    WithParentAutoSelect = 'with-parent-auto-select' // Children can be selected by parent & children can unselect parent
}
@WithRender
@Component({
    components: {
        [TREE_NODE_NAME]: MTreeNode
    }
})
export class MTree extends ModulVue {
    @Prop()
    public tree: TreeNode[];

    @Prop({
        default: MSelectionMode.Single,
        validator: value =>
            value === MSelectionMode.None ||
            value === MSelectionMode.Single ||
            value === MSelectionMode.Multiple ||
            value === MSelectionMode.Readonly
    })
    public selectionMode: MSelectionMode;

    @Prop({
        default: MCheckboxes.False,
        validator: value =>
            value === MCheckboxes.False ||
            value === MCheckboxes.True ||
            value === MCheckboxes.WithButtonAutoSelect ||
            value === MCheckboxes.WithCheckboxAutoSelect ||
            value === MCheckboxes.WithParentAutoSelect
    })
    public checkboxes: MCheckboxes;

    @Prop()
    public selectedNodes: string[];

    @Prop()
    public useFilesIcons: boolean;

    @Prop()
    public disabledNodes: string[];

    public propSelectedNodes: string[] = this.selectedNodes || [];

    public errorTree: boolean = false;

    private selectedNodesFound: string[] = [];

    @Emit('select')
    public onClick(path: string): string {
        if (!this.pathIsDisabled(path)) {
            if (this.propSelectedNodes.indexOf(path) === -1) {
                if (this.selectionMode === MSelectionMode.Multiple) {
                    this.propSelectedNodes.push(path);
                } else {
                    this.propSelectedNodes = [path];
                }
            } else if (this.selectionMode === MSelectionMode.Multiple) {
                this.propSelectedNodes.splice(this.propSelectedNodes.indexOf(path), 1);
            }
        }
        return path;
    }

    protected created(): void {
        this.browseTree();
    }

    @Watch('tree')
    private browseTree(): void {
        this.errorTree = false;
        this.tree.forEach(node => {
            this.browseNode(node);
        });
        this.propSelectedNodes.forEach(selectedNode => {
            if (this.selectedNodesFound.indexOf(selectedNode) === -1) {
                console.error(`modUL - The selected node was not found: "${selectedNode}"`);
            }
        });
    }

    private pathIsDisabled(path: string): boolean {
        return this.propDisabledNodes.indexOf(path) !== -1;
    }

    private browseNode(node: TreeNode, path: string = ''): void {
        if (node.id.trim() === '') {
            this.errorTree = true;
        }
        let currentPath: string = path + '/' + node.id;
        if (this.propSelectedNodes.indexOf(currentPath) !== -1) {
            this.selectedNodesFound.push(currentPath);
        }
        if (node.children) {
            node.children.forEach(childNode => {
                this.browseNode(childNode, currentPath);
            });
        }
    }

    public get propTreeEmpty(): boolean {
        return !this.tree.length;
    }

    public get propDisabledNodes(): string[] {
        return this.disabledNodes || [];
    }

    public get selectable(): boolean {
        return this.selectionMode !== MSelectionMode.None && !this.isReadonly;
    }

    public get isReadonly(): boolean {
        return this.selectionMode === MSelectionMode.Readonly;
    }

    public get isMultipleSelectWithCheckboxes(): boolean {
        return this.selectionMode === MSelectionMode.Multiple && this.withCheckboxes;
    }

    public get withCheckboxes(): boolean {
        return this.checkboxes !== MCheckboxes.False;
    }

    public get isSingleNodeTree(): boolean {
        return this.tree.length === 1;
    }
}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.use(CheckboxPlugin);
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.use(PlusPlugin);
        v.use(MessagePlugin);
        v.use(AccordionTransitionPlugin);
        v.component(TREE_NAME, MTree);
        v.component(TREE_NODE_NAME, MTreeNode);
        v.component(TREE_ICON_NAME, MTreeIcon);
    }
};

export default TreePlugin;
