import { shallow, Wrapper } from '@vue/test-utils';

import { MTreeFormat } from '../tree/tree';
import { MFileTree } from './file-tree';

const TREE_NODE_FILE: MTreeFormat = {
    elementLabel: 'Node 1.jpg',
    idNode: 'n1',
    elementPath: '/Node 1.jpg'
};

const TREE_NODE_FOLDER: MTreeFormat = {
    elementLabel: 'Node 2',
    idNode: '',
    elementPath: '/Node 2'
};

const FOLDER_OPEN: string = 'm-svg__file-openoffice-math';
const FOLDER_CLOSED: string = 'm-svg__file-zip';

let file: MTreeFormat;
let isOpen: boolean = false;
let wrapper: Wrapper<MFileTree<MTreeFormat>>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MFileTree, {
        stubs: getStubs(),
        propsData: {
            file,
            isOpen
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
        });

        it(`Then it should be a folder`, () => {
            initializeShallowWrapper();

            expect(wrapper.vm.isAFolder).toBeTruthy();
        });

        describe(`When the folder is open`, () => {

            it(`Then should be the right icon`, () => {
                isOpen = true;
                initializeShallowWrapper();

                expect(wrapper.vm.folderIcon).toEqual(FOLDER_OPEN);
            });

        });

        describe(`When the folder is close`, () => {

            it(`Then should be the right icon`, () => {
                isOpen = false;
                initializeShallowWrapper();

                expect(wrapper.vm.folderIcon).toEqual(FOLDER_CLOSED);
            });

        });

    });

    describe(`When the node is a file`, () => {

        beforeEach(() => {
            file = TREE_NODE_FILE;
            initializeShallowWrapper();
        });

        it(`Then it should not be a folder`, () => {
            expect(wrapper.vm.isAFolder).toBeFalsy();
        });

        describe(`When the file type is jpg`, () => {

            it(`Then the extensionFile should return .jpg`, () => {
                expect(wrapper.vm.extensionFile).toEqual('.jpg');
            });

        });

    });

});
