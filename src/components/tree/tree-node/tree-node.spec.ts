import { mount, RefSelector, shallow, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../../tests/helpers/render';
import { MCheckboxes, TreeNode } from '../tree';
import { MTreeNode } from './tree-node';

const CHILDREN: RefSelector = { ref: 'children' };
const ITEM: RefSelector = { ref: 'item' };
const CHECKBOX: RefSelector = { ref: 'checkbox' };
const AUTOSELECTBUTTON: RefSelector = { ref: 'autoSelectButton' };

const NODE_ELEMENT_LABEL: string = 'Node 1';
const NODE_ELEMENT_ID: string = 'Node 1';
const PARENT_PATH: string = '/Parent 1';
const CHECKBOX_PARENT: string = 'Parent 1';
const CHECKBOX_CHILD: string = 'Child 1';
const CHECKBOX_CHILD_2: string = 'Child 2';

const TREE_NODE_SELECTED: string[] = ['/Node 1'];
const TREE_NODE_SELECTED_2: string[] = ['/Node 2'];
const TREE_NODE_SELECTED_3: string[] = ['/Node 3/Node 4'];
const TREE_NODE_CHECKBOX_FIRST_CHILD: string[] = ['/Parent 1/Child 1'];
const TREE_NODE_CHECKBOX_ALL_CHILDREN: string[] = ['/Parent 1/Child 1', '/Parent 1/Child 2'];
const TREE_NODE_CHECKBOX_ALL_NODES: string[] = ['/Parent 1/Child 1', '/Parent 1', '/Parent 1/Child 2'];

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
            label: CHECKBOX_CHILD_2,
            id: CHECKBOX_CHILD_2,
            children: []
        }
    ]
};

let node: TreeNode;
let selectedNodes: string[] = [];
let selectable: boolean = true;
let icons: boolean = false;
let path: string = '';
let disabledNodes: string[] = [];
let checkboxes: MCheckboxes = MCheckboxes.False;

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
            disabledNodes,
            checkboxes
        }
    });
};

const initializeMountWrapper: any = () => {
    wrapper = mount(MTreeNode, {
        propsData: {
            node,
            selectedNodes,
            selectable,
            icons,
            path,
            disabledNodes,
            checkboxes
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
            checkboxes = MCheckboxes.False;
            disabledNodes = [];
        });

        describe(`When the node has a checkbox`, () => {

            beforeEach(() => {
                node = TREE_NODE_WITHOUT_CHILDREN;
                selectedNodes = [];
                checkboxes = MCheckboxes.True;
                initializeShallowWrapper();
            });

            it(`Should render properly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Should emit click on checkbox click`, () => {
                wrapper.find(CHECKBOX).trigger('click');
                expect(wrapper.emitted('click')).toBeTruthy();
            });

            describe(`and auto-select is on for parent checkboxes`, () => {
                describe(`and given node is a parent with two children and none selected`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = [];
                        checkboxes = MCheckboxes.WithParentAutoSelect;
                        initializeMountWrapper();
                    });

                    it(`Should select every children and self on checkbox click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(3);
                    });

                    it(`Should unselect every children and self on second checkbox click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(0);
                    });

                    it(`Should unselect checked parent when all children are selected and one goes to unselected state`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x).concat(PARENT_PATH) });
                        expect(wrapper.vm.selectedNodes.length).toBe(1);
                    });

                    it(`Should not select parent when all children are selected`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_ALL_CHILDREN.map(x => x) });
                        expect(wrapper.vm.selectedNodes.length).toBe(2);
                    });

                });
            });

            describe(`and auto-select is on for checkboxes`, () => {

                describe(`and given node is a parent with two children and none selected`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = [];
                        checkboxes = MCheckboxes.WithCheckboxAutoSelect;
                        initializeMountWrapper();
                    });

                    it(`Should select every children and self on checkbox click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(3);
                    });

                    it(`Should unselect every children and self on second checkbox click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(0);
                    });

                    it(`Should select every children if parent's state is undeterminated`, () => {
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x) });
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(3);
                    });

                    it(`Should unselect every children on checkbox click if all nodes are preselected`, () => {
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_ALL_NODES.map(x => x) });
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(0);
                    });

                    it(`Should be unable to select disabled node (and parent)`, () => {
                        wrapper.setProps({ disabledNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x) });
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(1);
                    });

                    it(`Should be unable to unselect disabled node`, () => {
                        wrapper.setProps({
                            selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x),
                            disabledNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                        });
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(1);
                    });

                    it(`Should unselect checked parent when all children are selected and one goes to unselected state`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x).concat(PARENT_PATH) });
                        expect(wrapper.vm.selectedNodes.length).toBe(1);
                    });

                    it(`Should select parent when all children are selected`, () => {
                        wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_ALL_CHILDREN.map(x => x) });
                        expect(wrapper.vm.selectedNodes.length).toBe(3);
                    });

                });

                describe(`and given node is the parent of a selected node and an unselected node`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x);
                        checkboxes = MCheckboxes.WithCheckboxAutoSelect;
                        initializeShallowWrapper();
                    });

                    it(`Should have isIndeterminated prop to true`, () => {
                        expect(wrapper.vm.isIndeterminate).toBeTruthy();
                    });

                });

            });

            describe(`and auto-select is in button mode while current node is a parent and no node are selected`, () => {

                beforeEach(() => {
                    node = TREE_NODE_WITH_TWO_CHILDREN;
                    selectedNodes = [];
                    checkboxes = MCheckboxes.WithButtonAutoSelect;
                    initializeMountWrapper();
                });

                it(`Should render properly`, () => {
                    expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                });

                it(`Should be unable to unselect disabled node`, () => {
                    wrapper.setProps({
                        selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x),
                        disabledNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                    });
                    wrapper.find(AUTOSELECTBUTTON).trigger('click');
                    wrapper.find(AUTOSELECTBUTTON).trigger('click');
                    expect(wrapper.vm.selectedNodes.length).toBe(1);
                });

                it(`Should be unable to select disabled node`, () => {
                    wrapper.setProps({
                        disabledNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                    });
                    wrapper.find(AUTOSELECTBUTTON).trigger('click');
                    expect(wrapper.vm.selectedNodes.length).toBe(2);
                });

                it(`Should select every children and self on button click`, () => {
                    wrapper.find(AUTOSELECTBUTTON).trigger('click');
                    expect(wrapper.vm.selectedNodes.length).toBe(3);
                });

            });

            describe(`and auto-select is off`, () => {

                describe(`and given node is a parent`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        checkboxes = MCheckboxes.True;
                        selectedNodes = [];
                        initializeMountWrapper();
                    });

                    it(`Should not select children on click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(0);
                    });

                    it(`Should emit click so parent component (tree) adds it to selected nodes`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.vm.selectedNodes.length).toBe(0);
                    });

                });

                describe(`and given node is the parent of a selected node and an unselected node`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = TREE_NODE_CHECKBOX_FIRST_CHILD;
                        checkboxes = MCheckboxes.True;
                        initializeShallowWrapper();
                    });

                    it(`Should have isIndeterminated prop to false`, () => {
                        expect(wrapper.vm.isIndeterminate).toBeFalsy();
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

    describe(`When nodes are added and removed`, () => {

        beforeEach(() => {
            node = TREE_NODE_WITHOUT_CHILDREN;
            selectedNodes = [];
            initializeShallowWrapper();
        });

        it(`Should be possible to add a single node`, () => {
            wrapper.vm.addNode(TREE_NODE_SELECTED[0]);
            expect(wrapper.vm.selectedNodes).toContain(TREE_NODE_SELECTED[0]);
            expect(wrapper.vm.selectedNodes.length).toBe(1);
        });

        it(`Should be possible to remove a single node`, () => {
            wrapper.setProps({ selectedNodes: TREE_NODE_SELECTED.map(x => x) });
            wrapper.vm.removeNode(TREE_NODE_SELECTED[0]);
            expect(wrapper.vm.selectedNodes.length).toBe(0);
        });

        describe(`When nodes are added or removed as an array`, () => {

            it(`Should be possible to add an array of nodes`, () => {
                wrapper.vm.updateSelectedNodes(TREE_NODE_CHECKBOX_ALL_NODES, true);
                expect(wrapper.vm.selectedNodes).toEqual(TREE_NODE_CHECKBOX_ALL_NODES);
            });

            it(`Should be possible to remove an array of selected nodes`, () => {
                wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_ALL_NODES.map(x => x) });
                wrapper.vm.updateSelectedNodes(TREE_NODE_CHECKBOX_ALL_NODES, false);
                expect(wrapper.vm.selectedNodes.length).toBe(0);
            });

            it(`Should be impossible to add the same nodes twice`, () => {
                wrapper.vm.updateSelectedNodes(TREE_NODE_CHECKBOX_ALL_NODES, true);
                wrapper.vm.updateSelectedNodes(TREE_NODE_CHECKBOX_ALL_NODES, true);
                expect(wrapper.vm.selectedNodes.length).toBe(3);
            });

            it(`Should remove existing nodes and ignore non-existing ones`, () => {
                wrapper.setProps({ selectedNodes: TREE_NODE_CHECKBOX_ALL_CHILDREN.map(x => x) });
                wrapper.vm.updateSelectedNodes(TREE_NODE_CHECKBOX_ALL_NODES, false);
                expect(wrapper.vm.selectedNodes.length).toBe(0);
            });

        });

    });

});
