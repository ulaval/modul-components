import { RefSelector, shallow, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../../tests/helpers/render';
import { TreeNode } from '../tree';
import { MTreeIcon } from './tree-icon';

const TREE_NODE_FILE: TreeNode = {
    label: 'Node 1.jpg',
    id: 'Node 1.jpg'
};

const TREE_NODE_FOLDER: TreeNode = {
    label: 'Node 2',
    id: '/Node 2'
};

const FOLDER_OPEN: string = 'm-svg__folder-open';
const FOLDER_CLOSED: string = 'm-svg__folder';
const PLUS: RefSelector = { ref: 'plus-icon' };

let file: TreeNode;
let folderOpen: boolean = false;
let folder: boolean = false;
let usePlusIcons: boolean = false;
let wrapper: Wrapper<MTreeIcon>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeIcon, {
        stubs: getStubs(),
        propsData: {
            file,
            folderOpen,
            folder,
            usePlusIcons
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
            folder = true;
        });

        describe(`When the node uses plus icons`, () => {
            beforeEach(() => {
                usePlusIcons = true;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it('Should use the m-plus component', () => {
                expect(wrapper.find(PLUS).exists()).toBeTruthy();
            });

        });

        describe(`When the node does not use plus icons`, () => {

            it('Should not use the m-plus component', () => {
                usePlusIcons = false;
                initializeShallowWrapper();
                expect(wrapper.find(PLUS).exists()).toBeFalsy();
            });

            describe(`When the folder is opened`, () => {

                it(`Should be the right icon`, () => {
                    folderOpen = true;
                    initializeShallowWrapper();

                    expect(wrapper.vm.folderIcon).toEqual(FOLDER_OPEN);
                });

            });

            describe(`When the folder is closed`, () => {

                it(`Should be the right icon`, () => {
                    folderOpen = false;
                    initializeShallowWrapper();

                    expect(wrapper.vm.folderIcon).toEqual(FOLDER_CLOSED);
                });

            });

        });

    });
});
