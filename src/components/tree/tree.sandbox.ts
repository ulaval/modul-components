import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TREE_NAME } from '../component-names';
import { TreeNode } from './tree';
import WithRender from './tree.sandbox.html';

export class Tree {
    nodeId: string;
    nodeLabel?: string;
    uselessData?: string;
    hasChildren?: boolean;
}

@WithRender
@Component
export class MRootTreeSandbox extends Vue {
    public currentFile: string[] = ['/folder 1/folder 2/index.html'];
    public currentFile2: string[] = ['/1/2'];
    public wrongCurrentFile: string[] = ['/3/4'];

    public emptyTree: TreeNode<Tree>[] = [];

    public tree: TreeNode<Tree>[] = [
        {
            content: {
                nodeId: '1',
                nodeLabel: 'Title 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: '2',
                        nodeLabel: 'Subtitle 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '3',
                        nodeLabel: 'Subtitle 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '4',
                        nodeLabel: 'Subtitle 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '5',
                        nodeLabel: 'Subtitle 4',
                        uselessData: 'test'
                    }
                }
            ]
        },
        {
            content: {
                nodeId: '6',
                nodeLabel: 'Title 2',
                uselessData: 'test'
            }
        },
        {
            content: {
                nodeId: '7',
                nodeLabel: 'Title 3',
                uselessData: 'test'
            },
            children: [
                {
                    content: {
                        nodeId: '1',
                        nodeLabel: 'Subtitle 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '2',
                        nodeLabel: 'Subtitle 2',
                        uselessData: 'test'
                    }
                }
            ]
        }
    ];

    public errorTree: TreeNode<Tree>[] = [
        {
            content: {
                nodeId: '1',
                nodeLabel: 'Title 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: '',
                        nodeLabel: 'Subtitle 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '3',
                        nodeLabel: 'Subtitle 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '4',
                        nodeLabel: 'Subtitle 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '5',
                        nodeLabel: 'Subtitle 4',
                        uselessData: 'test'
                    }
                }
            ]
        }
    ];

    public fileTree: TreeNode<Tree>[] = [
        {
            content: {
                nodeId: 'folder 1',
                nodeLabel: 'folder 1',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: 'index.html',
                        nodeLabel: 'index.html'
                    }
                },
                {
                    content: {
                        nodeId: 'menu.html'
                    }
                },
                {
                    content: {
                        nodeId: 'folder 2',
                        nodeLabel: 'folder 2',
                        hasChildren: true
                    },
                    children: [
                        {
                            content: {
                                nodeId: 'index.html',
                                nodeLabel: 'index.html'
                            }
                        },
                        {
                            content: {
                                nodeId: 'folder 3',
                                nodeLabel: 'folder 3',
                                hasChildren: true
                            },
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            content: {
                nodeId: 'poney.jpg',
                nodeLabel: 'poney.jpg'
            }
        },
        {
            content: {
                nodeId: 'folder 4',
                nodeLabel: 'folder 4',
                hasChildren: true
            }
        },
        {
            content: {
                nodeId: 'big folder',
                nodeLabel: 'big folder',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: 'folder 1',
                        nodeLabel: 'folder 1',
                        hasChildren: true
                    },
                    children: [
                        {
                            content: {
                                nodeId: 'index.html',
                                nodeLabel: 'index.html'
                            }
                        },
                        {
                            content: {
                                nodeId: 'menu.html'
                            }
                        },
                        {
                            content: {
                                nodeId: 'folder 2',
                                nodeLabel: 'folder 2',
                                hasChildren: true
                            },
                            children: [
                                {
                                    content: {
                                        nodeId: 'index.html',
                                        nodeLabel: 'index.html'
                                    }
                                },
                                {
                                    content: {
                                        nodeId: 'folder 3',
                                        nodeLabel: 'folder 3',
                                        hasChildren: true
                                    },
                                    children: [{
                                        content: {
                                            nodeId: 'folder 1',
                                            nodeLabel: 'folder 1',
                                            hasChildren: true
                                        },
                                        children: [
                                            {
                                                content: {
                                                    nodeId: 'index.html',
                                                    nodeLabel: 'index.html'
                                                }
                                            },
                                            {
                                                content: {
                                                    nodeId: 'menu.html'
                                                }
                                            },
                                            {
                                                content: {
                                                    nodeId: 'folder 2',
                                                    nodeLabel: 'folder 2',
                                                    hasChildren: true
                                                },
                                                children: [
                                                    {
                                                        content: {
                                                            nodeId: 'index.html',
                                                            nodeLabel: 'index.html'
                                                        }
                                                    },
                                                    {
                                                        content: {
                                                            nodeId: 'folder 3',
                                                            nodeLabel: 'folder 3',
                                                            hasChildren: true
                                                        },
                                                        children: [{
                                                            content: {
                                                                nodeId: 'folder 1',
                                                                nodeLabel: 'folder 1',
                                                                hasChildren: true
                                                            },
                                                            children: [
                                                                {
                                                                    content: {
                                                                        nodeId: 'index.html',
                                                                        nodeLabel: 'index.html'
                                                                    }
                                                                },
                                                                {
                                                                    content: {
                                                                        nodeId: 'menu.html'
                                                                    }
                                                                },
                                                                {
                                                                    content: {
                                                                        nodeId: 'folder 2',
                                                                        nodeLabel: 'folder 2',
                                                                        hasChildren: true
                                                                    },
                                                                    children: [
                                                                        {
                                                                            content: {
                                                                                nodeId: 'index.html',
                                                                                nodeLabel: 'index.html'
                                                                            }
                                                                        },
                                                                        {
                                                                            content: {
                                                                                nodeId: 'folder 3',
                                                                                nodeLabel: 'folder 3',
                                                                                hasChildren: true
                                                                            },
                                                                            children: []
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }]
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    public newNodeSelected(): void {
        console.error('modUL - New file selected');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
