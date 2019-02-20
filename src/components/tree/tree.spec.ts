import { mount, RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MCheckboxes, MSelectionMode, MTree, TreeNode } from './tree';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const ERROR_TREE_REF: RefSelector = { ref: 'error-tree-txt' };

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
let checkboxes: MCheckboxes;

let wrapper: Wrapper<MTree>;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MTree, {
        propsData: {
            tree,
            selectedNodes,
            selectionMode
        }
    });
};

const initializeMountWrapper: any = () => {
    wrapper = mount(MTree, {
        propsData: {
            tree,
            selectedNodes,
            selectionMode,
            checkboxes
        }
    });
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
            checkboxes = MCheckboxes.False;
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

        describe(`Given a tree with two nodes selected in readonly mode`, () => {

            beforeEach(() => {
                tree = TREE_WITH_DATA;
                selectionMode = MSelectionMode.Readonly;
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
