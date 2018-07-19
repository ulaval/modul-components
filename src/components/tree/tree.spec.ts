import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MTree, MTreeFormat, TreeNode } from './tree';

const EMPTY_TREE_REF: RefSelector = { ref: 'empty-tree-txt' };
const ERROR_TREE_REF: RefSelector = { ref: 'error-tree-txt' };
const TREE_NODE_REF: RefSelector = { ref: 'tree-node' };

const TXT_EMPTY_TREE: string = 'm-tree:empty';
const TXT_ERROR_TREE: string = 'm-tree:error';

const TREE_NODE_SELECTED: string[] = ['/medias/Videos/video-dog.mov'];
const NEW_TREE_NODE_SELECTED: string[] = ['/index.html'];

const EMPTY_TREE: TreeNode<MTreeFormat>[] = [];
const TREE_WITH_DATA: TreeNode<MTreeFormat>[] = [
    {
        content: {
            elementLabel: 'index.html',
            idNode: 'index.html'
        }
    },
    {
        content: {
            elementLabel: 'Medias',
            idNode: 'medias'
        },
        children: [
            {
                content: {
                    elementLabel: 'Videos',
                    idNode: 'Videos'
                }
            }
        ]
    }
];

let tree: TreeNode<MTreeFormat>[];
let wrapper: Wrapper<MTree<MTreeFormat>>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTree, {
        propsData: {
            tree: tree,
            externalSelectedNode: TREE_NODE_SELECTED
        }
    });
};

describe(`MTree`, () => {

    describe(`Given an empty tree`, () => {

        beforeEach(() => {
            tree = EMPTY_TREE;
            initializeShallowWrapper();
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should be empty`, () => {
            expect(wrapper.vm.isTreeEmpty()).toBeTruthy();
        });

        it(`Then a message should appear`, () => {
            expect(wrapper.find(EMPTY_TREE_REF).text()).toEqual(TXT_EMPTY_TREE);
        });

    });

    describe(`Given a tree with some data`, () => {

        beforeEach(() => {
            tree = TREE_WITH_DATA;
            initializeShallowWrapper();
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should not be empty`, () => {
            expect(wrapper.vm.isTreeEmpty()).toBeFalsy();
        });

        describe(`When a node is selected`, () => {

            beforeEach(() => {
                wrapper.vm.selectNewNode(NEW_TREE_NODE_SELECTED[0]);
            });

            it(`Then should call selectNewNode`, () => {
                wrapper.setMethods({ selectNewNode: jest.fn() });
                wrapper.find(TREE_NODE_REF).trigger('newNodeSelectected');

                expect(wrapper.vm.selectNewNode).toHaveBeenCalled();
            });

            it(`Then emit newNodeSelected`, () => {
                expect(wrapper.emitted('newNodeSelected')).toBeTruthy();
            });

            it(`Then a new node is selected`, () => {
                wrapper.vm.selectedNode = NEW_TREE_NODE_SELECTED;

                expect(wrapper.vm.selectedNode).toEqual(NEW_TREE_NODE_SELECTED);
            });
        });

        describe(`When there is an error in the tree`, () => {

            beforeEach(() => {
                initializeShallowWrapper();
                wrapper.vm.generateErrorTree();
            });

            it(`Then should call generateErrorTree`, () => {
                wrapper.setMethods({ generateErrorTree: jest.fn() });
                wrapper.find(TREE_NODE_REF).trigger('generateErrorTree');

                expect(wrapper.vm.generateErrorTree).toHaveBeenCalled();
            });

            it(`Then should generate an error`, () => {
                expect(wrapper.vm.errorTree).toBeTruthy();
            });

            it(`Then should show an error message`, () => {
                expect(wrapper.find(ERROR_TREE_REF).text()).toEqual(TXT_ERROR_TREE);
            });

        });

        describe(`When the selected node is found`, () => {

            beforeEach(() => {
                initializeShallowWrapper();
            });

            it(`Then should call selectedNodeFound`, () => {
                wrapper.setMethods({ selectedNodeFound: jest.fn() });
                wrapper.find(TREE_NODE_REF).trigger('selectedNodeFound');

                expect(wrapper.vm.selectedNodeFound).toHaveBeenCalled();
            });

        });

    });

});
