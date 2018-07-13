import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TREE_NAME } from '../component-names';
import { TreeNode } from './tree';
import WithRender from './tree.sandbox.html';

export class Tree {
    idNode: string;
    elementLabel: string;
    elementPath: string;
}

export class TextTree {
    idNode: string;
    elementLabel: string;
    elementPath: string;
    uselessInfo: string;
}

@WithRender
@Component
export class MRootTreeSandbox extends Vue {
    public currentFile: TreeNode<Tree>[] = [
        {
            content: {
                elementLabel: 'video-dog.mov',
                idNode: 'b2',
                elementPath: '/medias/Videos/video-dog.mov'
            },
            children: []
        }
    ];

    public currentFileEmpty: TreeNode<TextTree>[] = [];

    public emptyTree: TreeNode<TextTree>[] = [];

    public textTree: TreeNode<TextTree>[] = [
        {
            content: {
                idNode: '',
                elementLabel: 'Titre 1',
                uselessInfo: 'test',
                elementPath: ''
            },
            children: [
                {
                    content: {
                        idNode: 'a2',
                        elementLabel: 'Sous-titre 1',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                },
                {
                    content: {
                        idNode: 'a3',
                        elementLabel: 'Sous-titre 2',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                },
                {
                    content: {
                        idNode: 'a4',
                        elementLabel: 'Sous-titre 3',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                },
                {
                    content: {
                        idNode: '',
                        elementLabel: 'Sous-titre 4',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                }
            ]
        },
        {
            content: {
                idNode: 'b1',
                elementLabel: 'Titre 2',
                uselessInfo: 'test',
                elementPath: ''
            }
        },
        {
            content: {
                idNode: '',
                elementLabel: 'Titre 3',
                uselessInfo: 'test',
                elementPath: ''
            },
            children: [
                {
                    content: {
                        idNode: 'c1',
                        elementLabel: 'Sous-titre 4',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                },
                {
                    content: {
                        idNode: 'c2',
                        elementLabel: 'Sous-titre 5',
                        uselessInfo: 'test',
                        elementPath: ''
                    }
                }
            ]
        }
    ];

    public fileTree: TreeNode<Tree>[] = [
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
                },
                {
                    content: {
                        elementLabel: 'Music',
                        idNode: '',
                        elementPath: '/medias/Music'
                    },
                    children: []
                },
                {
                    content: {
                        elementLabel: 'lost-file.jpg',
                        idNode: 'b7',
                        elementPath: '/medias/lost-file.jpg'
                    },
                    children: []
                },
                {
                    content: {
                        elementLabel: 'img',
                        idNode: '',
                        elementPath: '/medias/img'
                    },
                    children: [
                        {
                            content: {
                                elementLabel: 'Animals.jpg',
                                idNode: 'c1',
                                elementPath: '/medias/img/Animals.jpg'
                            },
                            children: []
                        },
                        {
                            content: {
                                elementLabel: 'Birds.jpeg',
                                idNode: 'c2',
                                elementPath: '/medias/img/Birds.jpeg'
                            },
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            content: {
                elementLabel: 'Empty',
                idNode: '',
                elementPath: '/Empty'
            },
            children: []
        },
        {
            content: {
                elementLabel: 'html',
                idNode: '',
                elementPath: '/html'
            },
            children: [
                {
                    content: {
                        elementLabel: 'home.html',
                        idNode: 'j1',
                        elementPath: '/html/home.html'
                    },
                    children: []
                },
                {
                    content: {
                        elementLabel: 'event.html',
                        idNode: 'j2',
                        elementPath: '/html/event.html'
                    },
                    children: []
                }
            ]
        }
    ];

    public selectNewFile(): void {
        // console.log(file);
        // console.log('Ça passe');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
