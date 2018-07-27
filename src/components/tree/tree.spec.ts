import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MTree, MTreeFormat, TreeNode } from './tree';

const EMPTY_TREE_REF: RefSelector = { ref: 'empty-tree-txt' };
const ERROR_TREE_REF: RefSelector = { ref: 'error-tree-txt' };
const TREE_NODE_REF: RefSelector = { ref: 'tree-node' };
const BUTTON_TOGGLE_VISIBILITY_REF: RefSelector = { ref: 'button-toggle-visibility' };

const TXT_EMPTY_TREE: string = 'm-tree:empty';
const TXT_ERROR_TREE: string = 'm-tree:error';
const TXT_VISIBILITY_TREE_OPEN: string = 'm-tree:all-open';
const TXT_VISIBILITY_TREE_CLOSE: string = 'm-tree:all-close';

const TREE_NODE_SELECTED: string[] = ['/medias/Videos/video-dog.mov'];
const NEW_TREE_NODE_SELECTED: string[] = ['/index.html'];

const EMPTY_TREE: TreeNode<MTreeFormat>[] = [];
const TREE_WITH_DATA: TreeNode<MTreeFormat>[] = [
    {
        content: {
            nodeLabel: 'index.html',
            nodeId: 'index.html'
        }
    },
    {
        content: {
            nodeLabel: 'Medias',
            nodeId: 'medias'
        },
        children: [
            {
                content: {
                    nodeLabel: 'Videos',
                    nodeId: 'Videos'
                }
            }
        ]
    }
];

let tree: TreeNode<MTreeFormat>[];
let allOpen: boolean = false;
let wrapper: Wrapper<MTree>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTree, {
        propsData: {
            tree: tree,
            selectedNodes: TREE_NODE_SELECTED,
            allOpen
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
            expect(wrapper.vm.propTreeEmpty).toBeTruthy();
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
            expect(wrapper.vm.propTreeEmpty).toBeFalsy();
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
                expect(wrapper.vm.propSelectedNodes).toEqual(NEW_TREE_NODE_SELECTED);
            });
        });

        describe(`When there is an error in the tree`, () => {

            beforeEach(() => {
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

        });

        describe(`When the selected node is found`, () => {

            it(`Then should call selectedNodeFound`, () => {
                wrapper.setMethods({ selectedNodeFound: jest.fn() });
                wrapper.find(TREE_NODE_REF).trigger('selectedNodeFound');

                expect(wrapper.vm.selectedNodeFound).toHaveBeenCalled();
            });

        });

    });

    describe(`When you click on the button to show/hide every nodes`, () => {

        it(`Then call the function toggleAllVisibility`, () => {
            initializeShallowWrapper();

            wrapper.setMethods({ toggleAllVisibility: jest.fn() });
            wrapper.find(BUTTON_TOGGLE_VISIBILITY_REF).trigger('click');

            expect(wrapper.vm.toggleAllVisibility).toHaveBeenCalled();
        });

        describe(`and isAllOpen is false`, () => {

            beforeEach(() => {
                allOpen = false;
                initializeShallowWrapper();

                wrapper.find(BUTTON_TOGGLE_VISIBILITY_REF).trigger('click');
            });

            it(`All nodes should be open`, () => {
                expect(wrapper.vm.propAllOpen).toBeTruthy();
            });

            it(`The button label should become "m-tree:all-close"`, () => {
                expect(wrapper.vm.treeVisibilityTxt).toEqual(TXT_VISIBILITY_TREE_CLOSE);
            });

        });

        describe(`and isAllOpen is true`, () => {

            beforeEach(() => {
                allOpen = true;
                initializeShallowWrapper();

                wrapper.find(BUTTON_TOGGLE_VISIBILITY_REF).trigger('click');
            });

            it(`All nodes should be hidden`, () => {
                expect(wrapper.vm.propAllOpen).toBeFalsy();
            });

            it(`The button label should become "m-tree:all-open"`, () => {
                expect(wrapper.vm.treeVisibilityTxt).toEqual(TXT_VISIBILITY_TREE_OPEN);
            });

        });

    });

});
