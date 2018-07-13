import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MSelectOption, MTreeFormat, TreeNode } from '../tree/tree';
import { MTreeNode } from './tree-node';

const NODE_ELEMENT_LABEL: string = 'Node 1';

const TREE_NODE_WITH_A_FILE: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: NODE_ELEMENT_LABEL,
        idNode: 'n1',
        elementPath: '/Node 1'
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN_EMPTY: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: 'Node 2',
        idNode: '',
        elementPath: '/Node 2'
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: 'Node 3',
        idNode: '',
        elementPath: '/Node 3'
    },
    children: [
        {
            content: {
                elementLabel: 'Node 4',
                idNode: 'n4',
                elementPath: '/Node 3/Node 4'
            },
            children: []
        }
    ]
};

const TREE_NODE_SELECTED: TreeNode<MTreeFormat>[] = [
    {
        content: {
            elementLabel: NODE_ELEMENT_LABEL,
            idNode: 'n1',
            elementPath: '/Node 1'
        },
        children: []
    }
];
const TREE_NODE_SELECTED_2: TreeNode<MTreeFormat>[] = [
    {
        content: {
            elementLabel: 'Node 2',
            idNode: 'n2',
            elementPath: '/Node 2'
        },
        children: []
    }
];
const TREE_NODE_SELECTED_3: TreeNode<MTreeFormat>[] = [
    {
        content: {
            elementLabel: 'Node 4',
            idNode: 'n4',
            elementPath: '/Node 3/Node 4'
        },
        children: []
    }
];

let node: TreeNode<MTreeFormat>;
let externalSelectedNode: TreeNode<MTreeFormat>[] = [];
let selectionIcon: string = '';
let selectionNumber: MSelectOption = MSelectOption.SINGLE;
let isAllOpen: boolean = false;
let isFileTree: boolean = false;

let wrapper: Wrapper<MTreeNode<MTreeFormat>>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeNode, {
        stubs: getStubs(),
        propsData: {
            node,
            externalSelectedNode,
            selectionIcon,
            selectionNumber,
            isAllOpen,
            isFileTree
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-file-tree']: '<div>m-file-tree</div>',
        ['m-link']: '<a @click="$emit(\'click\')"><slot /></a>'
    };
};

describe('MTreeNode', () => {

    describe(`Given a node`, () => {

        describe(`When it's a file`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_A_FILE;
                initializeShallowWrapper();
            });

            it(`Then should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then should not be able to have children`, () => {
                expect(wrapper.vm.canHaveChildren).toBeFalsy();
            });

            it(`Then the node title should be "Node 1"`, () => {
                expect(wrapper.vm.nodeTitle).toEqual(NODE_ELEMENT_LABEL);
            });

        });

        describe(`When it's a folder without children`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_CHILDREN_EMPTY;
                initializeShallowWrapper();
            });

            it(`Then should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then should be able to have children`, () => {
                expect(wrapper.vm.canHaveChildren).toBeTruthy();
            });

            it(`Then should be disabled`, () => {
                expect(wrapper.vm.hasNoChild).toBeTruthy();
            });
        });

        describe(`When it's a folder with a child`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_CHILDREN;
                initializeShallowWrapper();
            });

            it(`Then should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then should be able to have children`, () => {
                expect(wrapper.vm.canHaveChildren).toBeTruthy();
            });

            it(`Then should not be disabled`, () => {
                expect(wrapper.vm.hasNoChild).toBeFalsy();
            });

            it(`Then it can't be selected`, () => {
                expect(wrapper.vm.isNodeSelected()).toBeFalsy();
            });

            describe(`When the node is a parent of the selected node`, () => {
                it(`Then the node should be open`, () => {
                    externalSelectedNode = TREE_NODE_SELECTED_3;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isOpen).toBeTruthy();
                });
            });

            describe(`When the node is not a parent of the selected node`, () => {
                it(`Then the node should not be open`, () => {
                    externalSelectedNode = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isOpen).toBeFalsy();
                });
            });

            describe(`When isAllOpen is true`, () => {
                it(`Then the node should be open`, () => {
                    isAllOpen = true;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isOpen).toBeTruthy();

                });
            });

        });

        describe(`When selectionNumber = single`, () => {

            it(`Then should emit "newNodeSelectected"`, () => {
                initializeShallowWrapper();

                wrapper.vm.selectNewNode(node[0]);

                expect(wrapper.emitted('newNodeSelectected')).toBeTruthy();
            });

            it(`Then the link should be a button`, () => {
                expect(wrapper.vm.linkMode).toEqual('button');
            });

        });

        describe(`When selectionNumber = none`, () => {

            beforeEach(() => {
                selectionNumber = MSelectOption.NONE;
                initializeShallowWrapper();
            });

            it(`Then should be able to select a node`, () => {
                wrapper.vm.selectNewNode(node[0]);

                expect(wrapper.emitted('newNodeSelectected')).toBeFalsy();
            });

            it(`Then the link should be text`, () => {
                expect(wrapper.vm.linkMode).toEqual('text');
            });

        });

        describe(`When we check if the current node is selected`, () => {
            beforeEach(() => {
                node = TREE_NODE_WITH_A_FILE;
            });

            describe(`When the current node is selected`, () => {
                it(`Then the node should be selected`, () => {
                    externalSelectedNode = TREE_NODE_SELECTED;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isNodeSelected()).toBeTruthy();
                });
            });

            describe(`When an other node is selected`, () => {
                it(`Then the node should not be selected`, () => {
                    externalSelectedNode = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isNodeSelected()).toBeFalsy();
                });
            });

            describe(`When no node is selected`, () => {
                it(`Then the node should not be selected`, () => {
                    externalSelectedNode = [];
                    initializeShallowWrapper();

                    expect(wrapper.vm.isNodeSelected()).toBeFalsy();
                });
            });
        });

    });

});
