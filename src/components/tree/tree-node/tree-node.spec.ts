import { mount, RefSelector, shallow, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../../tests/helpers/render';
import { TreeNode } from '../tree';
import { MTreeNode } from './tree-node';

const CHILDREN: RefSelector = { ref: 'children' };
const ITEM: RefSelector = { ref: 'item' };
const CHECKBOX: RefSelector = { ref: 'checkbox' };

const NODE_ELEMENT_LABEL: string = 'Node 1';
const NODE_ELEMENT_ID: string = 'Node 1';
const PARENT_PATH: string = '/Parent 1';
const CHECKBOX_PARENT: string = 'Parent 1';
const CHECKBOX_CHILD: string = 'Child 1';

const TREE_NODE_SELECTED: string[] = ['/Node 1'];
const TREE_NODE_SELECTED_2: string[] = ['/Node 2'];
const TREE_NODE_SELECTED_3: string[] = ['/Node 3/Node 4'];
const TREE_NODE_CHECKBOX_FIRST_CHILD: string[] = ['/Parent 1/Child 1'];
const TREE_NODE_CHECKBOX_PARENT: string[] = ['/Parent 1'];

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

const TREE_NODE_WITH_TWO_CHILDREN: TreeNode = {
    label: CHECKBOX_PARENT,
    id: CHECKBOX_PARENT,
    children: [
        {
            label: CHECKBOX_CHILD,
            id: CHECKBOX_CHILD,
            children: []
        },
        {
            label: 'Node 5',
            id: 'Node 5',
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
let selectedParentNodes: string[] = [];
let selectable: boolean = true;
let icons: boolean = false;
let path: string = '';
let disabledNodes: string[] = [];
let withCheckboxes: boolean = false;
let autoSelectCheckboxes: boolean = false;

let wrapper: Wrapper<MTreeNode>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeNode, {
        stubs: getStubs(),
        propsData: {
            node,
            selectedNodes,
            selectable,
            icons,
            path,
            withCheckboxes,
            disabledNodes,
            autoSelectCheckboxes
        }
    });
};

const initializeMountWrapper: any = () => {
    wrapper = mount(MTreeNode, {
        propsData: {
            node,
            selectedNodes,
            selectedParentNodes,
            selectable,
            icons,
            path,
            withCheckboxes,
            disabledNodes,
            autoSelectCheckboxes
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-tree-icon']: '<div>m-tree-icon</div>',
        ['m-link']: '<a @click="$emit(\'click\')"><slot /></a>',
        ['m-checkbox']: '<div @click="$emit(\'click\')">checkbox</div>'
    };
};

describe('MTreeNode', () => {

    describe(`Given a node`, () => {

        afterEach(() => {
            withCheckboxes = false;
            autoSelectCheckboxes = false;
            selectedParentNodes = [];
            disabledNodes = [];
        });

        describe(`When the node has a checkbox`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
                selectedNodes = [];
                withCheckboxes = true;
                initializeShallowWrapper();
            });

            it(`Should render properly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Should emit click on checkbox click`, () => {
                wrapper.find(CHECKBOX).trigger('click');
                expect(wrapper.emitted('click')).toBeTruthy();
            });

            describe(`and auto-select is on`, () => {

                describe(`and given node is a parent`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        autoSelectCheckboxes = true;
                        withCheckboxes = true;
                        selectedNodes = [];
                        initializeMountWrapper();
                    });

                    it(`Should select every children on checkbox click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedChildrenCount).toBe(2);
                    });

                    it(`Should make current node part of the selected parent nodes`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedParentNodes[0]).toBe(TREE_NODE_CHECKBOX_PARENT[0]);
                    });

                });

                describe(`and given node is the parent of a selected node and an unselected node`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = TREE_NODE_CHECKBOX_FIRST_CHILD;
                        autoSelectCheckboxes = true;
                        withCheckboxes = true;
                        initializeShallowWrapper();
                    });

                    it(`Should have isIndeterminated prop to true`, () => {
                        expect(wrapper.vm.isIndeterminated).toBeTruthy();
                    });

                });

            });

            describe(`and auto-select is off`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_TWO_CHILDREN;
                    autoSelectCheckboxes = false;
                    withCheckboxes = true;
                    selectedNodes = [];
                    initializeMountWrapper();
                });

                describe(`and given node is a parent`, () => {

                    it(`Should not select children on click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedChildrenCount).toBe(0);
                    });

                    it(`Should emit its path so parent adds it as selected nodes`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.emitted('click')[0][0]).toBe(TREE_NODE_CHECKBOX_PARENT[0]);
                    });

                });

                describe(`and given node is the parent of a selected node and an unselected node`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = TREE_NODE_CHECKBOX_FIRST_CHILD;
                        autoSelectCheckboxes = false;
                        withCheckboxes = true;
                        initializeShallowWrapper();
                    });

                    it(`Should have isIndeterminated prop to false`, () => {
                        expect(wrapper.vm.isIndeterminated).toBeFalsy();
                    });

                });

            });
        });

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

        describe(`When the node's path is part of the disabled nodes`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
                disabledNodes = TREE_NODE_SELECTED;
                initializeShallowWrapper();
            });

            it(`Should be disabled`, () => {
                wrapper.vm.onClick();
                expect(wrapper.vm.isDisabled).toBeTruthy();
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

                describe(`and we open the node`, () => {

                    beforeEach(() => {
                        wrapper.vm.internalOpen = false;
                        wrapper.vm.onClick();
                    });

                    it(`Then should be open`, () => {
                        expect(wrapper.vm.internalOpen).toBeTruthy();
                    });

                    it(`Then the event update:open is emitted with the value true`, () => {
                        expect(wrapper.emitted('update:open')).toBeTruthy();
                        expect(wrapper.emitted('update:open')[0]).toEqual([true]);
                    });

                });

                describe(`and we close the node`, () => {

                    beforeEach(() => {
                        wrapper.vm.internalOpen = true;
                        wrapper.vm.onClick();
                    });

                    it(`Then should be closed`, () => {
                        expect(wrapper.vm.internalOpen).toBeFalsy();
                    });

                    it(`Then the event update:open is emitted with the value false`, () => {
                        expect(wrapper.emitted('update:open')).toBeTruthy();
                        expect(wrapper.emitted('update:open')[0]).toEqual([false]);
                    });

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
