import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
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

const TREE_NODE_WITH_OPENED_CHILD: TreeNode = {
    id: 'folder 1',
    label: 'folder 1',
    hasChildren: true,
    children: [
        {
            id: 'index.html',
            label: 'index.html'
        },
        {
            id: 'menu.html'
        },
        {
            id: 'folder 2',
            label: 'folder 2',
            hasChildren: true,
            open: true,
            children: [
                {
                    id: 'index.html',
                    label: 'index.html'
                },
                {
                    id: 'folder 3',
                    label: 'folder 3',
                    hasChildren: true,
                    children: []
                }
            ]
        }
    ]
};

const TREE_NODE_WITHOUT_OPENED_CHILD: TreeNode = {
    id: 'folder 1',
    label: 'folder 1',
    hasChildren: true,
    children: [
        {
            id: 'index.html',
            label: 'index.html'
        },
        {
            id: 'menu.html'
        },
        {
            id: 'folder 2',
            label: 'folder 2',
            hasChildren: true,
            children: [
                {
                    id: 'index.html',
                    label: 'index.html'
                },
                {
                    id: 'folder 3',
                    label: 'folder 3',
                    hasChildren: true,
                    children: []
                }
            ]
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
let readonly: boolean = false;

let wrapper: Wrapper<MTreeNode>;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MTreeNode, {
        stubs: getStubs(),
        propsData: {
            node,
            selectedNodes,
            selectable,
            icons,
            path,
            disabledNodes,
            checkboxes,
            readonly
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-tree-icon']: '<div>m-tree-icon</div>',
        ['m-link']: '<a @click="$emit(\'click\')"><slot /></a>',
        ['m-checkbox']: '<div @click="$emit(\'change\')">checkbox</div>'
    };
};

describe('MTreeNode', () => {

    describe(`Given a closed node with an internally opened child`, () => {

        beforeEach(() => {
            node = TREE_NODE_WITH_OPENED_CHILD;
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Should have current node internally opened`, () => {
            expect(wrapper.vm.internalOpen).toBe(true);
        });
    });

    describe(`Given a closed node without an internally opened child`, () => {

        beforeEach(() => {
            node = TREE_NODE_WITHOUT_OPENED_CHILD;
            initializeShallowWrapper();
        });

        it(`Should have current node internally closed`, () => {
            expect(wrapper.vm.internalOpen).toBe(false);
        });
    });

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

            describe(`and the node is the parent of two nodes`, () => {

                describe(`and auto-select is on`, () => {

                    describe(`for checkboxes`, () => {

                        beforeEach(() => {
                            node = TREE_NODE_WITH_TWO_CHILDREN;
                            selectedNodes = [];
                            checkboxes = MCheckboxes.WithCheckboxAutoSelect;
                            initializeShallowWrapper();
                        });

                        it(`Should have inderminate prop to true when children are selected`, () => {
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                            });
                            expect(wrapper.vm.isIndeterminate).toBeTruthy();
                        });

                        // TODO: Repair this test.  It broke after going to vue-test-utils ^1.0.0-beta.28
                        /*
                        it(`Should auto-select parent when children are selected`, async () => {
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_ALL_CHILDREN.map(x => x)
                            });

                            expect(wrapper.emitted('click').length).toBe(1);
                        }); */

                    });

                    describe(`for parents`, () => {

                        beforeEach(() => {
                            node = TREE_NODE_WITH_TWO_CHILDREN;
                            selectedNodes = [];
                            checkboxes = MCheckboxes.WithParentAutoSelect;
                            initializeShallowWrapper();
                        });

                        it(`Should have inderminate prop to true when children are selected`, () => {
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                            });
                            expect(wrapper.vm.isIndeterminate).toBeTruthy();
                        });

                        it(`Should select every children and self on click`, () => {
                            wrapper.find(CHECKBOX).trigger('click');
                            expect(wrapper.emitted('click').length).toBe(3);
                        });

                        it(`Should not auto-select parent when children are selected`, () => {
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_ALL_CHILDREN.map(x => x)
                            });
                            expect(wrapper.emitted('click')).toBeFalsy();
                        });

                        it(`Should unselect parent when all children were selected but one changed`, () => {
                            wrapper.find(CHECKBOX).trigger('click');
                            expect(wrapper.vm.isIndeterminate).toBeFalsy();
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                            });
                            expect(wrapper.vm.isIndeterminate).toBeTruthy();
                        });


                    });

                    describe(`for buttons`, () => {

                        beforeEach(() => {
                            node = TREE_NODE_WITH_TWO_CHILDREN;
                            selectedNodes = [];
                            checkboxes = MCheckboxes.WithButtonAutoSelect;
                            initializeShallowWrapper();
                        });

                        it(`Should have inderminate prop to false when children are selected`, () => {
                            wrapper.setProps({
                                selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                            });
                            expect(wrapper.vm.isIndeterminate).toBeFalsy();
                        });

                        it(`Should render properly`, () => {
                            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
                        });

                        it(`Should select every children and self on button click`, () => {
                            wrapper.find(AUTOSELECTBUTTON).trigger('click');
                            expect(wrapper.emitted('click').length).toBe(3);
                        });

                    });

                });

                describe(`and auto-select is off`, () => {

                    beforeEach(() => {
                        node = TREE_NODE_WITH_TWO_CHILDREN;
                        selectedNodes = [];
                        checkboxes = MCheckboxes.True;
                        initializeShallowWrapper();
                    });

                    it(`Should have inderminate prop to false when children are selected`, () => {
                        wrapper.setProps({
                            selectedNodes: TREE_NODE_CHECKBOX_FIRST_CHILD.map(x => x)
                        });
                        expect(wrapper.vm.isIndeterminate).toBeFalsy();
                    });

                    it(`Should select select self (parent) on click`, () => {
                        wrapper.find(CHECKBOX).trigger('click');
                        expect(wrapper.emitted('click').length).toBe(1);
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

        describe(`When readonly = true`, () => {

            beforeEach(() => {
                readonly = true;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
    });
});
