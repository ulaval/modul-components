import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MTree, TreeNode } from './tree';

export class TreeUnit {
    idNode: string;
    elementLabel: string;
    elementPath: string;
}

const treeNode: TreeNode<TreeUnit>[] = [
    {
        content: {
            elementLabel: 'video-dog.mov',
            idNode: 'b2',
            elementPath: '/medias/Videos/video-dog.mov'
        },
        children: []
    }
];
const newTreeNode: TreeNode<TreeUnit>[] = [
    {
        content: {
            elementLabel: 'index.html',
            idNode: 'a1',
            elementPath: '/index.html'
        }
    }
];

const emptyTree: TreeNode<TreeUnit>[] = [];
const treeWithData: TreeNode<TreeUnit>[] = [
    {
        content: {
            elementLabel: 'index.html',
            idNode: 'a1',
            elementPath: '/index.html'
        }
    },
    {
        content: {
            elementLabel: 'Medias',
            idNode: '',
            elementPath: '/medias'
        },
        children: [
            {
                content: {
                    elementLabel: 'Videos',
                    idNode: '',
                    elementPath: '/medias/Videos'
                },
                children: [
                    {
                        content: {
                            elementLabel: 'video_cat.mp4',
                            idNode: 'b1',
                            elementPath: '/medias/Videos/video_cat.mp4'
                        },
                        children: []
                    },
                    {
                        content: {
                            elementLabel: 'video-dog.mov',
                            idNode: 'b2',
                            elementPath: '/medias/Videos/video-dog.mov'
                        },
                        children: []
                    }
                ]
            }
        ]
    }
];

let wrapper: Wrapper<MTree<TreeUnit>>;
let tree: TreeNode<TreeUnit>[];

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTree, {
        stubs: getStubs(),
        propsData: {
            tree: tree,
            externalSelectedNode: newTreeNode
        }
    });
};

const getStubs: any = () => {
    return {
        ['m-tree-node']: '<div>m-tree-node</div>'
    };
};

describe(`MTree`, () => {

    describe(`Given an empty tree`, () => {

        beforeEach(() => {
            tree = emptyTree;
            initializeShallowWrapper();
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should be empty`, () => {
            expect(wrapper.vm.isTreeEmpty()).toBeTruthy();
        });

    });

    describe(`Given a tree with some data`, () => {

        beforeEach(() => {
            tree = treeWithData;
            initializeShallowWrapper();
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should not be empty`, () => {
            expect(wrapper.vm.isTreeEmpty()).toBeFalsy();
        });

        describe(`When a node is selected`, () => {

            beforeEach(() => {
                wrapper.vm.selectNewNode(newTreeNode[0]);
            });

            it(`Then emit newNodeSelected`, () => {
                expect(wrapper.emitted('newNodeSelected'));
            });

            it(`Then a new node is selected`, () => {
                expect(wrapper.vm.internalSelectedNode).toEqual(newTreeNode);
            });
        });

    });

});
