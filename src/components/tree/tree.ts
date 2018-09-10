import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import TreeNodePlugin from '../tree-node/tree-node';
import WithRender from './tree.html?style=./tree.scss';

export interface TreeNode {
    id: string;
    label?: string;
    open?: boolean;
    children?: TreeNode[];
    hasChildren?: boolean;
    data?: any;
}

export enum MSelectionMode {
    None = '0',
    Single = '1',
    Multiple = '2'
}

@WithRender
@Component
export class MTree extends ModulVue {
    @Prop()
    public tree: TreeNode[];

    @Prop({
        default: MSelectionMode.Single,
        validator: value =>
            value === MSelectionMode.None ||
            value === MSelectionMode.Single ||
            value === MSelectionMode.Multiple
    })
    public selectionMode: MSelectionMode;

    @Prop()
    public selectedNodes: string[];

    @Prop()
    public icons: boolean;

    public propSelectedNodes: string[] = this.selectedNodes || [];
    public errorTree: boolean = false;

    private selectedNodesFound: string[] = [];

    public onClick(path: string): void {
        if (this.propSelectedNodes.indexOf(path) === -1) {
            if (this.selectionMode === MSelectionMode.Multiple) {
                this.propSelectedNodes.push(path);
            } else {
                this.propSelectedNodes = [path];
            }
        } else if (this.selectionMode === MSelectionMode.Multiple) {
            this.propSelectedNodes.splice(this.propSelectedNodes.indexOf(path), 1);
        }
        this.$emit('select', path);
    }

    public get propTreeEmpty(): boolean {
        return !this.tree.length;
    }

    public get selectable(): boolean {
        return this.selectionMode !== MSelectionMode.None;
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
}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NAME, 'plugin.install');
        v.use(TreeNodePlugin);
        v.use(I18nPlugin);
        v.component(TREE_NAME, MTree);
    }
};

export default TreePlugin;
