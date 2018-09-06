import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { TreeNode } from '../tree/tree';
import { MTreeNode } from './tree-node';

const CHILDREN: RefSelector = { ref: 'children' };
const ITEM: RefSelector = { ref: 'item' };

const NODE_ELEMENT_LABEL: string = 'Node 1';
const NODE_ELEMENT_ID: string = 'Node 1';
const PARENT_PATH: string = '/Parent 1';
const SELECTION_ICON: string = 'information';

const TREE_NODE_SELECTED: string[] = ['/Node 1'];
const TREE_NODE_SELECTED_2: string[] = ['/Node 2'];
const TREE_NODE_SELECTED_3: string[] = ['/Node 3/Node 4'];

const TREE_NODE_WITHOUT_CHILDREN: TreeNode = {
    label: NODE_ELEMENT_LABEL,
    id: NODE_ELEMENT_ID
};

const TREE_NODE_WITHOUT_CHILDREN_NOT_VALID: TreeNode = {
    label: NODE_ELEMENT_LABEL,
    id: '',
    children: []
};

const TREE_NODE_WITH_CHILDREN_EMPTY: TreeNode = {
    label: 'Node 2',
    id: 'Node 2',
    hasChildren: true,
    children: []
};

const TREE_NODE_WITH_CHILDREN: TreeNode = {
    label: 'Node 3',
    id: 'Node 3',
    children: [
        {
            label: 'Node 4',
            id: 'Node 4',
            children: []
        }
    ]
};

const TREE_NODE_WITH_CHILDREN_NOT_VALID: TreeNode = {
    label: 'Node 3',
    id: '',
    hasChildren: true,
    children: [
        {
            label: 'Node 4',
            id: 'Node 4',
            children: []
        }
    ]
};

let node: TreeNode;
let selectedNodes: string[] = [];
let selectable: boolean = true;
let icons: boolean = false;
let path: string = '';

let wrapper: Wrapper<MTreeNode>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeNode, {
        stubs: getStubs(),
        propsData: {
            node,
            selectedNodes,
            selectable,
            icons,
            path
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-tree-icon']: '<div>m-tree-icon</div>',
        ['m-link']: '<a @click="$emit(\'click\')"><slot /></a>'
    };
};

describe('MTreeNode', () => {

    describe(`Given a node`, () => {

        describe(`When the node can't have children`, () => {

            describe(`and the node is valid`, () => {
                beforeEach(() => {
                    node = TREE_NODE_WITHOUT_CHILDREN;
                    initializeShallowWrapper();
                });

                it(`Should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`The node label should be "Node 1"`, () => {
                    expect(wrapper.vm.label).toEqual(NODE_ELEMENT_LABEL);
                });

                it(`The node does not have children`, () => {
                    expect(wrapper.vm.hasChildren).toBeFalsy();
                });
            });

            describe(`and the node is not valid`, () => {
                beforeEach(() => {
                    node = TREE_NODE_WITHOUT_CHILDREN_NOT_VALID;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });
            });

        });

        describe(`When the node can have children but don't have any`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_CHILDREN_EMPTY;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

        });

        describe(`When the node can and has children`, () => {

            describe(`and the node is valid`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_CHILDREN;
                    initializeShallowWrapper();
                });

                it(`Should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Should have children`, () => {
                    expect(wrapper.vm.hasChildren).toBeTruthy();
                });

            });

            describe(`When the node is a parent of the selected node`, () => {
                it(`The node should be open`, () => {
                    selectedNodes = TREE_NODE_SELECTED_3;
                    initializeShallowWrapper();

                    expect(wrapper.find(CHILDREN)).toBeTruthy();
                });
            });

            describe(`When the node is not a parent of the selected node`, () => {
                it(`The node should not be open`, () => {

                    node = TREE_NODE_WITH_CHILDREN;
                    selectedNodes = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.find(CHILDREN)).toBeTruthy();
                });
            });

        });

        describe(`When selectionMode = single`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
                initializeShallowWrapper();
            });

            it(`Should emit "click"`, () => {
                wrapper.find(ITEM).trigger('click');

                expect(wrapper.emitted('click')).toBeTruthy();
            });

        });

        describe(`When not selectable`, () => {

            beforeEach(() => {
                selectable = false;
                node = TREE_NODE_WITHOUT_CHILDREN;
                initializeShallowWrapper();
            });

            it(`Should not be able to select a node`, () => {
                wrapper.find(ITEM).trigger('click');

                expect(wrapper.emitted('click')).toBeFalsy();
            });
        });

        describe(`When we check if the current node is selected`, () => {
            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
            });

            describe(`When the current node is selected`, () => {

                beforeEach(() => {
                    selectedNodes = TREE_NODE_SELECTED;
                });

                describe(`and selectionIcon is not empty`, () => {
                    beforeEach(() => {
                        initializeShallowWrapper();
                    });

                    it(`The node should be selected`, () => {
                        expect(wrapper.vm.isSelected).toBeTruthy();
                    });
                });
            });

            describe(`When an other node is selected`, () => {
                it(`The node should not be selected`, () => {
                    selectedNodes = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isSelected).toBeFalsy();
                });
            });

            describe(`When no node is selected`, () => {
                it(`The node should not be selected`, () => {
                    selectedNodes = [];
                    initializeShallowWrapper();

                    expect(wrapper.vm.isSelected).toBeFalsy();
                });
            });
        });

        describe(`When the node has a parent`, () => {

            it(`Should return the right current path`, () => {
                path = PARENT_PATH;
                node = TREE_NODE_WITHOUT_CHILDREN;
                initializeShallowWrapper();

                expect(wrapper.vm.currentPath).toEqual(PARENT_PATH + '/' + NODE_ELEMENT_ID);
            });
        });

    });

});
