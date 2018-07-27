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
    public currentFile: string[] = ['/dossier 1/dossier 2/index.html'];
    public currentFile2: string[] = ['/1/2'];
    public wrongCurrentFile: string[] = ['/3/4'];

    public emptyTree: TreeNode<Tree>[] = [];

    public tree: TreeNode<Tree>[] = [
        {
            content: {
                nodeId: '1',
                nodeLabel: 'Titre 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: '2',
                        nodeLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '3',
                        nodeLabel: 'Sous-titre 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '4',
                        nodeLabel: 'Sous-titre 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '5',
                        nodeLabel: 'Sous-titre 4',
                        uselessData: 'test'
                    }
                }
            ]
        },
        {
            content: {
                nodeId: '6',
                nodeLabel: 'Titre 2',
                uselessData: 'test'
            }
        },
        {
            content: {
                nodeId: '7',
                nodeLabel: 'Titre 3',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: '1',
                        nodeLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '2',
                        nodeLabel: 'Sous-titre 2',
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
                nodeLabel: 'Titre 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: '',
                        nodeLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '3',
                        nodeLabel: 'Sous-titre 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '4',
                        nodeLabel: 'Sous-titre 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        nodeId: '5',
                        nodeLabel: 'Sous-titre 4',
                        uselessData: 'test'
                    }
                }
            ]
        }
    ];

    public fileTree: TreeNode<Tree>[] = [
        {
            content: {
                nodeId: 'dossier 1',
                nodeLabel: 'dossier 1',
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
                        nodeId: 'dossier 2',
                        nodeLabel: 'dossier 2',
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
                                nodeId: 'dossier 3',
                                nodeLabel: 'dossier 3',
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
                nodeId: 'dossier 4',
                nodeLabel: 'dossier 4',
                hasChildren: true
            }
        },
        {
            content: {
                nodeId: 'gros dossier',
                nodeLabel: 'gros dossier',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        nodeId: 'dossier 1',
                        nodeLabel: 'dossier 1',
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
                                nodeId: 'dossier 2',
                                nodeLabel: 'dossier 2',
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
                                        nodeId: 'dossier 3',
                                        nodeLabel: 'dossier 3',
                                        hasChildren: true
                                    },
                                    children: [{
                                        content: {
                                            nodeId: 'dossier 1',
                                            nodeLabel: 'dossier 1',
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
                                                    nodeId: 'dossier 2',
                                                    nodeLabel: 'dossier 2',
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
                                                            nodeId: 'dossier 3',
                                                            nodeLabel: 'dossier 3',
                                                            hasChildren: true
                                                        },
                                                        children: [{
                                                            content: {
                                                                nodeId: 'dossier 1',
                                                                nodeLabel: 'dossier 1',
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
                                                                        nodeId: 'dossier 2',
                                                                        nodeLabel: 'dossier 2',
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
                                                                                nodeId: 'dossier 3',
                                                                                nodeLabel: 'dossier 3',
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
