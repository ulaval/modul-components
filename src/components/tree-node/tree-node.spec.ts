import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MSelectOption, MTreeFormat, TreeNode } from '../tree/tree';
import { MTreeNode } from './tree-node';

const EMPTY_NODE_REF: RefSelector = { ref: 'empty-node-txt' };
const TXT_EMPTY_NODE: string = 'm-tree-node:empty';
const NODE_ELEMENT_LABEL: string = 'Node 1';
const NODE_ELEMENT_ID: string = 'Node 1';
const PARENT_PATH: string = '/Parent 1';

const TREE_NODE_SELECTED: string[] = ['/Node 1'];
const TREE_NODE_SELECTED_2: string[] = ['/Node 2'];
const TREE_NODE_SELECTED_3: string[] = ['/Node 3/Node 4'];

const TREE_NODE_WITHOUT_CHILDREN: TreeNode<MTreeFormat> = {
    content: {
        nodeLabel: NODE_ELEMENT_LABEL,
        nodeId: NODE_ELEMENT_ID
    },
    children: []
};

const TREE_NODE_WITHOUT_CHILDREN_NOT_VALID: TreeNode<MTreeFormat> = {
    content: {
        nodeLabel: NODE_ELEMENT_LABEL,
        nodeId: ''
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN_EMPTY: TreeNode<MTreeFormat> = {
    content: {
        nodeLabel: 'Node 2',
        nodeId: 'Node 2',
        hasChildren: true
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN: TreeNode<MTreeFormat> = {
    content: {
        nodeLabel: 'Node 3',
        nodeId: 'Node 3',
        hasChildren: true
    },
    children: [
        {
            content: {
                nodeLabel: 'Node 4',
                nodeId: 'Node 4'
            },
            children: []
        }
    ]
};

const TREE_NODE_WITH_CHILDREN_NOT_VALID: TreeNode<MTreeFormat> = {
    content: {
        nodeLabel: 'Node 3',
        nodeId: '',
        hasChildren: true
    },
    children: [
        {
            content: {
                nodeLabel: 'Node 4',
                nodeId: 'Node 4'
            },
            children: []
        }
    ]
};

let node: TreeNode<MTreeFormat>;
let selectedNodes: string[] = [];
let currentPath: string = '';
let selectionIcon: string = '';
let selectionQuantity: MSelectOption = MSelectOption.SINGLE;
let allOpen: boolean = false;
let fileTree: boolean = false;

let wrapper: Wrapper<MTreeNode<MTreeFormat>>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeNode, {
        stubs: getStubs(),
        propsData: {
            node,
            selectedNodes,
            selectionIcon,
            selectionQuantity,
            allOpen,
            fileTree,
            currentPath
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

        describe(`When the node can't have children`, () => {

            describe(`and the node is valid`, () => {
                beforeEach(() => {
                    node = TREE_NODE_WITHOUT_CHILDREN;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Then the node title should be "Node 1"`, () => {
                    expect(wrapper.vm.nodeTitle).toEqual(NODE_ELEMENT_LABEL);
                });

                it(`Then the node has not valid children`, () => {
                    let hasValidChildren: boolean = wrapper.vm.hasValidChildren();

                    expect(hasValidChildren).toBeFalsy();
                });

                it(`Then the node is valid`, () => {
                    let isValid: boolean = wrapper.vm.validNode();

                    expect(isValid).toBeTruthy();
                });

                it(`Then we don't emit generateErrorTree`, () => {
                    wrapper.vm.validNode();

                    expect(wrapper.vm.generateErrorTree).toHaveBeenCalledTimes(0);
                });
            });

            describe(`and the node is not valid`, () => {
                beforeEach(() => {
                    node = TREE_NODE_WITHOUT_CHILDREN_NOT_VALID;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then the node is not valid`, () => {
                    let isValid: boolean = wrapper.vm.validNode();

                    expect(isValid).toBeFalsy();
                    expect(wrapper.vm.generateErrorTree).toHaveBeenCalled();
                });

                it(`Then we emit generateErrorTree`, () => {
                    wrapper.vm.validNode();

                    expect(wrapper.vm.generateErrorTree).toHaveBeenCalled();
                });
            });

        });

        describe(`When the node can have children but don't have any`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_CHILDREN_EMPTY;
                initializeShallowWrapper();
                wrapper.setMethods({ generateErrorTree: jest.fn() });
            });

            it(`Then should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then should display a message`, () => {
                expect(wrapper.vm.childrenNotEmpty).toBeFalsy();
                expect(wrapper.find(EMPTY_NODE_REF).text()).toEqual(TXT_EMPTY_NODE);
            });

            it(`Then the node is valid`, () => {
                let isValid: boolean = wrapper.vm.hasValidChildren();

                expect(isValid).toBeTruthy();
            });

            it(`Then we don't emit generateErrorTree`, () => {
                wrapper.vm.hasValidChildren();

                expect(wrapper.vm.generateErrorTree).toHaveBeenCalledTimes(0);
            });

        });

        describe(`When the node can and has children`, () => {

            describe(`and the node is valid`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_CHILDREN;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Then should have children`, () => {
                    expect(wrapper.vm.childrenNotEmpty).toBeTruthy();
                });

                it(`Then the node is valid`, () => {
                    let isValid: boolean = wrapper.vm.hasValidChildren();

                    expect(isValid).toBeTruthy();
                });

                it(`Then we don't emit generateErrorTree`, () => {
                    wrapper.vm.hasValidChildren();

                    expect(wrapper.vm.generateErrorTree).toHaveBeenCalledTimes(0);
                });

            });

            describe(`and the node is not valid`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_CHILDREN_NOT_VALID;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then the node is not valid`, () => {
                    let isValid: boolean = wrapper.vm.hasValidChildren();

                    expect(isValid).toBeFalsy();
                });

                it(`Then we emit generateErrorTree`, () => {
                    wrapper.vm.hasValidChildren();

                    expect(wrapper.vm.generateErrorTree).toHaveBeenCalled();
                });

            });

            describe(`When the node is a parent of the selected node`, () => {
                it(`Then the node should be open`, () => {
                    selectedNodes = TREE_NODE_SELECTED_3;
                    initializeShallowWrapper();

                    expect(wrapper.vm.open).toBeTruthy();
                });
            });

            describe(`When the node is not a parent of the selected node`, () => {
                it(`Then the node should not be open`, () => {

                    node = TREE_NODE_WITH_CHILDREN;
                    selectedNodes = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.open).toBeFalsy();
                });
            });

            describe(`When allOpen is true`, () => {
                it(`Then the node should be open`, () => {
                    node = TREE_NODE_WITH_CHILDREN;
                    allOpen = true;
                    initializeShallowWrapper();

                    expect(wrapper.vm.open).toBeTruthy();

                });
            });

        });

        describe(`When selectionQuantity = single`, () => {

            beforeEach(() => {
                initializeShallowWrapper();
            });

            it(`Then should emit "newNodeSelectected"`, () => {
                wrapper.vm.selectNewNode(node[0]);

                expect(wrapper.emitted('newNodeSelectected')).toBeTruthy();
            });

            it(`Then the link should be a button`, () => {
                expect(wrapper.vm.typeLink).toEqual('button');
            });

        });

        describe(`When selectionQuantity = none`, () => {

            beforeEach(() => {
                selectionQuantity = MSelectOption.NONE;
                initializeShallowWrapper();
            });

            it(`Then should be able to select a node`, () => {
                wrapper.vm.selectNewNode(node[0]);

                expect(wrapper.emitted('newNodeSelectected')).toBeFalsy();
            });

            it(`Then the link should be text`, () => {
                expect(wrapper.vm.typeLink).toEqual('text');
            });

        });

        describe(`When we check if the current node is selected`, () => {
            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
            });

            describe(`When the current node is selected`, () => {
                it(`Then the node should be selected`, () => {
                    selectedNodes = TREE_NODE_SELECTED;
                    initializeShallowWrapper();

                    expect(wrapper.vm.nodeSelected()).toBeTruthy();
                });
            });

            describe(`When an other node is selected`, () => {
                it(`Then the node should not be selected`, () => {
                    selectedNodes = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.nodeSelected()).toBeFalsy();
                });
            });

            describe(`When no node is selected`, () => {
                it(`Then the node should not be selected`, () => {
                    selectedNodes = [];
                    initializeShallowWrapper();

                    expect(wrapper.vm.nodeSelected()).toBeFalsy();
                });
            });
        });

        describe(`When the node has a parent`, () => {

            it(`Then should return the right current path`, () => {
                currentPath = PARENT_PATH;
                node = TREE_NODE_WITHOUT_CHILDREN;
                initializeShallowWrapper();

                expect(wrapper.vm.propCurrentPath).toEqual(PARENT_PATH + '/' + NODE_ELEMENT_ID);
            });
        });

    });

});
