import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TREE_NAME } from '../component-names';
import { TreeNode } from './tree';
import WithRender from './tree.sandbox.html';

export class Tree {
    idNode: string;
    elementLabel?: string;
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
                idNode: '1',
                elementLabel: 'Titre 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        idNode: '2',
                        elementLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '3',
                        elementLabel: 'Sous-titre 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '4',
                        elementLabel: 'Sous-titre 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '5',
                        elementLabel: 'Sous-titre 4',
                        uselessData: 'test'
                    }
                }
            ]
        },
        {
            content: {
                idNode: '6',
                elementLabel: 'Titre 2',
                uselessData: 'test'
            }
        },
        {
            content: {
                idNode: '7',
                elementLabel: 'Titre 3',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        idNode: '1',
                        elementLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '2',
                        elementLabel: 'Sous-titre 2',
                        uselessData: 'test'
                    }
                }
            ]
        }
    ];

    public errorTree: TreeNode<Tree>[] = [
        {
            content: {
                idNode: '1',
                elementLabel: 'Titre 1',
                uselessData: 'test',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        idNode: '',
                        elementLabel: 'Sous-titre 1',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '3',
                        elementLabel: 'Sous-titre 2',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '4',
                        elementLabel: 'Sous-titre 3',
                        uselessData: 'test'
                    }
                },
                {
                    content: {
                        idNode: '5',
                        elementLabel: 'Sous-titre 4',
                        uselessData: 'test'
                    }
                }
            ]
        }
    ];

    public fileTree: TreeNode<Tree>[] = [
        {
            content: {
                idNode: 'dossier 1',
                elementLabel: 'dossier 1',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        idNode: 'index.html',
                        elementLabel: 'index.html'
                    }
                },
                {
                    content: {
                        idNode: 'menu.html'
                    }
                },
                {
                    content: {
                        idNode: 'dossier 2',
                        elementLabel: 'dossier 2',
                        hasChildren: true
                    },
                    children: [
                        {
                            content: {
                                idNode: 'index.html',
                                elementLabel: 'index.html'
                            }
                        },
                        {
                            content: {
                                idNode: 'dossier 3',
                                elementLabel: 'dossier 3',
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
                idNode: 'poney.jpg',
                elementLabel: 'poney.jpg'
            }
        },
        {
            content: {
                idNode: 'dossier 4',
                elementLabel: 'dossier 4',
                hasChildren: true
            }
        },
        {
            content: {
                idNode: 'gros dossier',
                elementLabel: 'gros dossier',
                hasChildren: true
            },
            children: [
                {
                    content: {
                        idNode: 'dossier 1',
                        elementLabel: 'dossier 1',
                        hasChildren: true
                    },
                    children: [
                        {
                            content: {
                                idNode: 'index.html',
                                elementLabel: 'index.html'
                            }
                        },
                        {
                            content: {
                                idNode: 'menu.html'
                            }
                        },
                        {
                            content: {
                                idNode: 'dossier 2',
                                elementLabel: 'dossier 2',
                                hasChildren: true
                            },
                            children: [
                                {
                                    content: {
                                        idNode: 'index.html',
                                        elementLabel: 'index.html'
                                    }
                                },
                                {
                                    content: {
                                        idNode: 'dossier 3',
                                        elementLabel: 'dossier 3',
                                        hasChildren: true
                                    },
                                    children: [{
                                        content: {
                                            idNode: 'dossier 1',
                                            elementLabel: 'dossier 1',
                                            hasChildren: true
                                        },
                                        children: [
                                            {
                                                content: {
                                                    idNode: 'index.html',
                                                    elementLabel: 'index.html'
                                                }
                                            },
                                            {
                                                content: {
                                                    idNode: 'menu.html'
                                                }
                                            },
                                            {
                                                content: {
                                                    idNode: 'dossier 2',
                                                    elementLabel: 'dossier 2',
                                                    hasChildren: true
                                                },
                                                children: [
                                                    {
                                                        content: {
                                                            idNode: 'index.html',
                                                            elementLabel: 'index.html'
                                                        }
                                                    },
                                                    {
                                                        content: {
                                                            idNode: 'dossier 3',
                                                            elementLabel: 'dossier 3',
                                                            hasChildren: true
                                                        },
                                                        children: [{
                                                            content: {
                                                                idNode: 'dossier 1',
                                                                elementLabel: 'dossier 1',
                                                                hasChildren: true
                                                            },
                                                            children: [
                                                                {
                                                                    content: {
                                                                        idNode: 'index.html',
                                                                        elementLabel: 'index.html'
                                                                    }
                                                                },
                                                                {
                                                                    content: {
                                                                        idNode: 'menu.html'
                                                                    }
                                                                },
                                                                {
                                                                    content: {
                                                                        idNode: 'dossier 2',
                                                                        elementLabel: 'dossier 2',
                                                                        hasChildren: true
                                                                    },
                                                                    children: [
                                                                        {
                                                                            content: {
                                                                                idNode: 'index.html',
                                                                                elementLabel: 'index.html'
                                                                            }
                                                                        },
                                                                        {
                                                                            content: {
                                                                                idNode: 'dossier 3',
                                                                                elementLabel: 'dossier 3',
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
        console.error('New file selected');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
