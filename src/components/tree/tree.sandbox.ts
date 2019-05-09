import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { TREE_NAME } from '../component-names';
import TreePlugin, { TreeNode } from './tree';
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
    public currentNodesBasic: string[] = [];
    public currentNodesCheckboxes: string[] = ['/3/11'];
    public disabledNodesCheckboxes: string[] = ['/3/11'];
    public currentNodesCheckboxesParent: string[] = [];
    public currentNodesCheckboxesButtonAutoselect: string[] = [];
    public currentNodesCheckboxesNone: string[] = ['/1/11/444/1111'];
    public disabledNodesCheckboxesNone: string[] = ['/3', '/1/11/444/2222'];

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
            open: true,
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

    public tree2: TreeNode[] = [
        {
            id: '6',
            label: 'Title 1'
        },
        {
            id: '1',
            label: 'Title 2',
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
            id: '7',
            label: 'Title 3',
            open: true
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
                                            open: true,
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
                                                                    id: 'folder 12',
                                                                    label: 'folder 12',
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

    public multiNodeTree: TreeNode[] = [
        {
            id: '1',
            label: 'UL - Université Laval',
            hasChildren: true,
            children: [
                {
                    id: '11',
                    label: 'FSG - Faculté de Sciences et Génie',
                    children: [
                        {
                            id: '111',
                            label: 'ACT - Actuariat'
                        },
                        {
                            id: '222',
                            label: 'BIO - Biologie'
                        },
                        {
                            id: '333',
                            label: 'CHM - Chimie'
                        },
                        {
                            id: '444',
                            label: 'GMCN - Génie Mécanique',
                            children: [
                                {
                                    id: '1111',
                                    label: 'PRS - Personne',
                                    rightIconName: 'm-svg__warning'
                                },
                                {
                                    id: '2222',
                                    label: 'SMT - Something',
                                    rightIconName: 'm-svg__warning'
                                }
                            ],
                            rightIconName: 'm-svg__warning'
                        }
                    ]
                },
                {
                    id: '22',
                    label: 'LLI - Lettres et sciences humaines',
                    children: [
                        {
                            id: '111',
                            label: 'JPN - Japonais'
                        },
                        {
                            id: '222',
                            label: 'EN - Anglais'
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            label: 'CSF - Cégep Sainte-Foy'
        },
        {
            id: '3',
            label: 'UQAM - Université du Québec à Montréal',
            children: [
                {
                    id: '11',
                    label: 'CHM - Chimie'
                },
                {
                    id: '22',
                    label: 'GMCN - Génie Mécanique'
                }
            ]
        }
    ];

    public onSelect(): void {
        console.error('modUL - New node selected');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TreePlugin);
        v.component(`${TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
