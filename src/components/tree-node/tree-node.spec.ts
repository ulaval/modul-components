import { RefSelector, shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MSelectOption, MTreeFormat, TreeNode } from '../tree/tree';
import { MTreeNode } from './tree-node';

const EMPTY_NODE_REF: RefSelector = { ref: 'empty-node-txt' };
const TXT_EMPTY_NODE: string = 'm-tree-node:empty';

const NODE_ELEMENT_LABEL: string = 'Node 1';

const TREE_NODE_WITH_A_FILE: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: NODE_ELEMENT_LABEL,
        idNode: 'Node 1'
    },
    children: []
};

const TREE_NODE_WITH_A_FILE_NOT_VALID: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: NODE_ELEMENT_LABEL,
        idNode: ''
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN_EMPTY: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: 'Node 2',
        idNode: 'Node 2',
        hasChildren: true
    },
    children: []
};

const TREE_NODE_WITH_CHILDREN: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: 'Node 3',
        idNode: 'Node 3',
        hasChildren: true
    },
    children: [
        {
            content: {
                elementLabel: 'Node 4',
                idNode: 'Node 4'
            },
            children: []
        }
    ]
};

const TREE_NODE_WITH_CHILDREN_NOT_VALID: TreeNode<MTreeFormat> = {
    content: {
        elementLabel: 'Node 3',
        idNode: '',
        hasChildren: true
    },
    children: [
        {
            content: {
                elementLabel: 'Node 4',
                idNode: 'Node 4'
            },
            children: []
        }
    ]
};

const TREE_NODE_SELECTED: string[] = ['/Node 1'];
const TREE_NODE_SELECTED_2: string[] = ['/Node 2'];
const TREE_NODE_SELECTED_3: string[] = ['/Node 3/Node 4'];

let node: TreeNode<MTreeFormat>;
let externalSelectedNode: string[] = [];
let externalCurrentPath: string = '';
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
            isFileTree,
            externalCurrentPath
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
                    node = TREE_NODE_WITH_A_FILE;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Then should not be able to have children`, () => {
                    expect(wrapper.vm.hasChildren).toBeFalsy();
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
                    node = TREE_NODE_WITH_A_FILE_NOT_VALID;
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

        describe(`When can have children but don't have children`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITH_CHILDREN_EMPTY;
                initializeShallowWrapper();
                wrapper.setMethods({ generateErrorTree: jest.fn() });
            });

            it(`Then should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then should be able to have children`, () => {
                expect(wrapper.vm.hasChildren).toBeTruthy();
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

        describe(`When it's a folder with a child`, () => {

            describe(`and the node is valid`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_CHILDREN;
                    initializeShallowWrapper();
                    wrapper.setMethods({ generateErrorTree: jest.fn() });
                });

                it(`Then should render correctly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Then should be able to have children`, () => {
                    expect(wrapper.vm.hasChildren).toBeTruthy();
                });

                it(`Then should have children`, () => {
                    expect(wrapper.vm.childrenNotEmpty).toBeTruthy();
                });

                it(`Then it can't be selected`, () => {
                    expect(wrapper.vm.isNodeSelected()).toBeFalsy();
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
                    externalSelectedNode = TREE_NODE_SELECTED_3;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isOpen).toBeTruthy();
                });
            });

            describe(`When the node is not a parent of the selected node`, () => {
                it(`Then the node should not be open`, () => {

                    node = TREE_NODE_WITH_CHILDREN;
                    externalSelectedNode = TREE_NODE_SELECTED_2;
                    initializeShallowWrapper();

                    expect(wrapper.vm.isOpen).toBeFalsy();
                });
            });

            describe(`When isAllOpen is true`, () => {
                it(`Then the node should be open`, () => {
                    node = TREE_NODE_WITH_CHILDREN;
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
                expect(wrapper.vm.typeLink).toEqual('button');
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
                expect(wrapper.vm.typeLink).toEqual('text');
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

        describe(`When the node has a parent`, () => {

            it(`Then should return the right current path`, () => {
                externalCurrentPath = '/Folder 1';
                node = TREE_NODE_WITH_A_FILE;
                initializeShallowWrapper();

                expect(wrapper.vm.currentPath).toEqual('/Folder 1/Node 1');
            });
        });

    });

});
