import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MSelectionMode, MTree, TreeNode } from './tree';

const TREE_NODE_REF: RefSelector = { ref: 'tree-node' };
const EMPTY_TREE_REF: RefSelector = { ref: 'empty-tree-txt' };
const ERROR_TREE_REF: RefSelector = { ref: 'error-tree-txt' };

const SELECTED_NODES: string[] = ['/medias/Videos'];
const SELECTED_NODES_INVALID: string[] = ['/medias/Videos/video-dog.mov'];
const NEW_TREE_NODE_SELECTED: string[] = ['/index.html'];

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
const TREE_WITH_NIVALID_DATA: TreeNode[] = [
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

let wrapper: Wrapper<MTree>;

let tree: TreeNode[] = TREE_WITH_DATA;
let selectionMode: MSelectionMode = MSelectionMode.Single;
let selectedNodes: string[] = SELECTED_NODES;

afterEach(() => {
    tree = [];
    selectionMode = MSelectionMode.Single;
    selectedNodes = SELECTED_NODES;
});

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTree, {
        propsData: {
            tree,
            selectedNodes,
            selectionMode
        }
    });
};

describe(`MTree`, () => {

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
                tree = TREE_WITH_NIVALID_DATA;
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
