import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { TreeNode } from '../tree';
import { MTreeIcon } from './tree-icon';

const TREE_NODE_FOLDER: TreeNode = {
    label: 'Node 2',
    id: '/Node 2'
};

const FOLDER_OPEN: string = 'm-svg__folder-open';
const FOLDER_CLOSED: string = 'm-svg__folder';
const PLUS: RefSelector = { ref: 'plus-icon' };

let file: TreeNode;
let isFolderOpen: boolean = false;
let isFolder: boolean = false;
let useFilesIcons: boolean = false;
let wrapper: Wrapper<MTreeIcon>;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MTreeIcon, {
        stubs: getStubs(),
        propsData: {
            file,
            isFolderOpen,
            isFolder,
            useFilesIcons
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-icon']: '<span>m-icon</span>',
        ['m-icon-file']: '<span>m-icon-file</span>'
    };
};

describe(`MTreeIcon`, () => {

    describe(`When the node is a folder`, () => {

        beforeEach(() => {
            file = TREE_NODE_FOLDER;
            useFilesIcons = false;
            isFolderOpen = false;
            isFolder = true;
        });

        describe(`When the node uses the plus icon (not the folder icon)`, () => {
            beforeEach(() => {
                useFilesIcons = false;
                initializeShallowWrapper();
            });

            it('Should use the m-plus component', () => {
                expect(wrapper.find(PLUS).exists()).toBeTruthy();
            });

        });

        describe(`When the node uses the folder icon`, () => {

            it('Should not include the m-plus component', () => {
                useFilesIcons = true;
                initializeShallowWrapper();
                expect(wrapper.find(PLUS).exists()).toBeFalsy();

            });

            describe(`When the folder is opened`, () => {

                it(`Should be the right icon`, () => {
                    isFolderOpen = true;
                    initializeShallowWrapper();

                    expect(wrapper.vm.folderIcon).toEqual(FOLDER_OPEN);
                });

            });

            describe(`When the folder is closed`, () => {

                it(`Should be the right icon`, () => {
                    isFolderOpen = false;
                    initializeShallowWrapper();

                    expect(wrapper.vm.folderIcon).toEqual(FOLDER_CLOSED);
                });

            });

        });

    });
});
