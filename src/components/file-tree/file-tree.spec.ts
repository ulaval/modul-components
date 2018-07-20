import { shallow, Wrapper } from '@vue/test-utils';

import { MTreeFormat } from '../tree/tree';
import { MFileTree } from './file-tree';

const TREE_NODE_FILE: MTreeFormat = {
    elementLabel: 'Node 1.jpg',
    idNode: 'Node 1.jpg'
};

const TREE_NODE_FOLDER: MTreeFormat = {
    elementLabel: 'Node 2',
    idNode: '/Node 2'
};

const FOLDER_OPEN: string = 'm-svg__file-openoffice-math';
const FOLDER_CLOSED: string = 'm-svg__file-zip';

let file: MTreeFormat;
let folderOpen: boolean = false;
let folder: boolean = false;
let wrapper: Wrapper<MFileTree<MTreeFormat>>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MFileTree, {
        stubs: getStubs(),
        propsData: {
            file,
            folderOpen,
            folder
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-icon']: '<span>m-icon</span>',
        ['m-icon-file']: '<span>m-icon-file</span>'
    };
};

describe(`MFileTree`, () => {

    describe(`When the node is a folder`, () => {

        beforeEach(() => {
            file = TREE_NODE_FOLDER;
            folder = true;
        });

        describe(`When the folder is open`, () => {

            it(`Then should be the right icon`, () => {
                folderOpen = true;
                initializeShallowWrapper();

                expect(wrapper.vm.folderIcon).toEqual(FOLDER_OPEN);
            });

        });

        describe(`When the folder is close`, () => {

            it(`Then should be the right icon`, () => {
                folderOpen = false;
                initializeShallowWrapper();

                expect(wrapper.vm.folderIcon).toEqual(FOLDER_CLOSED);
            });

        });

    });

    describe(`When the node is a file`, () => {

        beforeEach(() => {
            file = TREE_NODE_FILE;
            folder = false;
            initializeShallowWrapper();
        });
        describe(`When the file type is jpg`, () => {

            it(`Then the extensionFile should return .jpg`, () => {
                expect(wrapper.vm.extensionFile).toEqual('.jpg');
            });

        });

    });

});
