import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TREE_NAME } from '../component-names';
import { TreeNode } from './tree';
import WithRender from './tree.sandbox.html';

export class Tree {
    id: string;
    label?: string;
    uselessData?: string;
    hasChildren?: boolean;
}

@WithRender
@Component
export class MRootTreeSandbox extends Vue {
    public currentFile: string[] = ['/folder 1/folder 2/index.html'];
    public currentFile2: string[] = ['/1/2'];
    public wrongCurrentFile: string[] = ['/3/4'];

    public emptyTree: TreeNode[] = [];

    public tree: TreeNode[] = [
        {
            id: '1',
            label: 'Title 1',
            hasChildren: true,
            children: [
                {
                    id: '2',
                    label: 'Subtitle 1'
                },
                {
                    id: '3',
                    label: 'Subtitle 2',
                    children: [
                        {
                            id: '2',
                            label: 'Subtitle 1'
                        },
                        {
                            id: '3',
                            label: 'Subtitle 2',
                            hasChildren: true
                        },
                        {
                            id: '4',
                            label: 'Subtitle 3'
                        },
                        {
                            id: '5',
                            label: 'Subtitle 4'
                        }
                    ]
                },
                {
                    id: '4',
                    label: 'Subtitle 3'
                },
                {
                    id: '5',
                    label: 'Subtitle 4'
                }
            ]
        },
        {
            id: '6',
            label: 'Title 2'
        },
        {
            id: '7',
            label: 'Title 3',
            children: [
                {
                    id: '1',
                    label: 'Subtitle 1'
                },
                {
                    id: '2',
                    label: 'Subtitle 2'
                }
            ]
        }
    ];

    public errorTree: TreeNode[] = [
        {
            id: '1',
            label: 'Title 1',
            hasChildren: true,
            children: [
                {
                    id: '',
                    label: 'Subtitle 1'
                },
                {
                    id: '3',
                    label: 'Subtitle 2'
                },
                {
                    id: '4',
                    label: 'Subtitle 3'
                },
                {
                    id: '5',
                    label: 'Subtitle 4'
                }
            ]
        }
    ];

    public fileTree: TreeNode[] = [
        {
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
        },
        {
            id: 'poney.jpg',
            label: 'poney.jpg'
        },
        {
            id: 'folder 4',
            label: 'folder 4',
            hasChildren: true
        },
        {
            id: 'big folder',
            label: 'big folder',
            hasChildren: true,
            children: [
                {
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
                                    children: [
                                        {
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
                                                            children: [
                                                                {
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
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    public onSelect(): void {
        console.error('modUL - New file selected');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
