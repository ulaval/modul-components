import { shallow, Wrapper } from '@vue/test-utils';
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

let file: TreeNode;
let folderOpen: boolean = false;
let folder: boolean = false;
let useAccordionIcons: boolean = false;
let wrapper: Wrapper<MTreeIcon>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTreeIcon, {
        stubs: getStubs(),
        propsData: {
            file,
            folderOpen,
            folder,
            useAccordionIcons
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

        describe(`When the node uses accordion icons`, () => {
            beforeEach(() => {
                useAccordionIcons = true;
            });

            it(`Should render correctly`, () => {
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When the node is not expandable`, () => {

            beforeEach(() => {
                useAccordionIcons = false;
            });

            it(`Should render correctly`, () => {
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
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
