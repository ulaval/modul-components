import { mount, RefSelector, shallow, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { MSelectionMode, MTree, TreeNode } from './tree';
import TreeNodePlugin from './tree-node/tree-node';

const TREE_NODE_REF: RefSelector = { ref: 'tree-node' };
const ERROR_TREE_REF: RefSelector = { ref: 'error-tree-txt' };
const CHECKBOX: RefSelector = { ref: 'checkbox' };

const SELECTED_NODE: string[] = ['/medias/Videos'];
const SELECTED_NODES: string[] = ['/index.html', '/medias/Videos'];
const NEW_TREE_NODE_SELECTED: string[] = ['/index.html'];
const NEW_TREE_NODES_SELECTED: string[] = ['/index.html', '/medias/Videos'];
const SELECTED_NODE_CLASS: string = '.m--is-selected';

const EMPTY_TREE: TreeNode[] = [];
const TREE_WITH_DATA: TreeNode[] = [
    {
        label: 'index.html',
        id: 'index.html'
    },
    {
        label: 'Medias',
        id: 'medias',
        children: [
            {
                label: 'Videos',
                id: 'Videos'
            }
        ]
    }
];
const TREE_WITH_INVALID_DATA: TreeNode[] = [
    {
        label: 'index.html',
        id: ''
    },
    {
        label: 'Medias',
        id: 'medias',
        children: [
            {
                label: 'Videos',
                id: 'Videos'
            }
        ]
    }
];

let tree: TreeNode[] = TREE_WITH_DATA;
let selectionMode: MSelectionMode = MSelectionMode.Single;
let selectedNodes: string[] = SELECTED_NODE;
let withCheckboxes: boolean = false;

let wrapper: Wrapper<MTree>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTree, {
        propsData: {
            tree,
            selectedNodes,
            selectionMode
        }
    });
};

const initializeMountWrapper: any = () => {
    wrapper = mount(MTree, {
        stubs: getStubs(),
        propsData: {
            tree,
            selectedNodes,
            selectionMode,
            withCheckboxes
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-checkbox']: '<div @click="$emit(\'click\')">checkbox</div>'
    };
};

describe(`MTree`, () => {

    describe('Given a single node selection', () => {
        afterEach(() => {
            tree = [];
            selectionMode = MSelectionMode.Single;
            selectedNodes = SELECTED_NODE;
        });

        describe(`Given an empty tree`, () => {

            beforeEach(() => {
                tree = EMPTY_TREE;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Should be empty`, () => {
                expect(wrapper.vm.propTreeEmpty).toBeTruthy();
            });
        });

        describe(`Given a tree with some data`, () => {

            beforeEach(() => {
                tree = TREE_WITH_DATA;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Should not be empty`, () => {
                expect(wrapper.vm.propTreeEmpty).toBeFalsy();
            });

            describe(`When a node is selected`, () => {

                beforeEach(() => {
                    wrapper.vm.onClick(NEW_TREE_NODE_SELECTED[0]);
                });

                it(`Call onClick`, () => {
                    wrapper.setMethods({ onClick: jest.fn() });
                    wrapper.find(TREE_NODE_REF).trigger('click');

                    expect(wrapper.vm.onClick).toHaveBeenCalled();
                });

                it(`Emit select`, () => {
                    expect(wrapper.emitted('select')).toBeTruthy();
                });

                it(`A new node is selected`, () => {
                    expect(wrapper.vm.propSelectedNodes).toEqual(NEW_TREE_NODE_SELECTED);
                });

            });

            describe(`When there is an error in the tree`, () => {

                beforeEach(() => {
                    tree = TREE_WITH_INVALID_DATA;
                    initializeShallowWrapper();
                });

                it(`Should generate an error`, () => {
                    expect(wrapper.vm.errorTree).toBeTruthy();
                });

                it(`Should show an error message`, () => {
                    expect(wrapper.find(ERROR_TREE_REF).exists()).toBeTruthy();
                });

            });
        });
    });

    describe(`Given a tree with multiple selection`, () => {

        afterEach(() => {
            tree = [];
            selectedNodes = [];
            withCheckboxes = false;
            Vue.use(TreeNodePlugin);
        });

        describe(`Given a tree with no node selected`, () => {

            beforeEach(() => {
                tree = TREE_WITH_DATA;
                selectedNodes = [];
                selectionMode = MSelectionMode.Multiple;
                initializeMountWrapper();
            });

            it(`Should allow multiple selection`, () => {
                wrapper.vm.onClick(NEW_TREE_NODES_SELECTED[0]);
                wrapper.vm.onClick(NEW_TREE_NODES_SELECTED[1]);
                expect(wrapper.vm.propSelectedNodes).toEqual(NEW_TREE_NODES_SELECTED);
            });

            describe(`with checkboxes`, () => {

                beforeEach(() => {
                    tree = TREE_WITH_DATA;
                    selectedNodes = [];
                    selectionMode = MSelectionMode.Multiple;
                    withCheckboxes = true;
                    initializeMountWrapper();
                });

                it(`Should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Should prevent node from being pushed to selectedNodes if click is not from checkbox`, () => {
                    wrapper.vm.onClick(NEW_TREE_NODES_SELECTED[0]);
                    expect(wrapper.vm.propSelectedNodes.length).toEqual(0);
                });

                it(`Should allow node to be pushed to selectedNodes if click is from checkbox`, () => {
                    wrapper.find(CHECKBOX).trigger('click');
                    expect(wrapper.vm.propSelectedNodes.length).toEqual(0);
                });
            });

        });

        describe(`Given a tree with two nodes selected`, () => {

            beforeEach(() => {
                tree = TREE_WITH_DATA;
                selectedNodes = [];
                selectionMode = MSelectionMode.Multiple;
                selectedNodes = SELECTED_NODES;
                initializeMountWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Should render with two selected nodes`, () => {
                expect(wrapper.findAll(SELECTED_NODE_CLASS).length).toBe(2);
            });
        });
    });
});
