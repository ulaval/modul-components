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
            childs: []
        }
    ];

    public currentFileEmpty: TreeNode<string>[] = [];

    public emptyTree: TreeNode<string>[] = [
    ];

    public textTree: TreeNode<TextTree>[] = [
        {
            content: {
                idNode: '',
                elementLabel: 'Titre 1'
            },
            childs: [
                {
                    content: {
                        idNode: 'a2',
                        elementLabel: 'Sous-titre 1'
                    },
                    childs: []
                },
                {
                    content: {
                        idNode: 'a3',
                        elementLabel: 'Sous-titre 2'
                    },
                    childs: []
                },
                {
                    content: {
                        idNode: 'a4',
                        elementLabel: 'Sous-titre 3'
                    },
                    childs: []
                }
            ]
        },
        {
            content: {
                idNode: 'b1',
                elementLabel: 'Titre 2'
            },
            childs: []
        }
    ];

    public fileTree: TreeNode<Tree>[] = [
        {
            content: {
                elementLabel: 'index.html',
                idNode: 'a1',
                elementPath: '/index.html'
            },
            childs: []
        },
        {
            content: {
                elementLabel: 'Medias',
                idNode: '',
                elementPath: '/medias'
            },
            childs: [
                {
                    content: {
                        elementLabel: 'Videos',
                        idNode: '',
                        elementPath: '/medias/Videos'
                    },
                    childs: [
                        {
                            content: {
                                elementLabel: 'video_cat.mp4',
                                idNode: 'b1',
                                elementPath: '/medias/Videos/video_cat.mp4'
                            },
                            childs: []
                        },
                        {
                            content: {
                                elementLabel: 'video-dog.mov',
                                idNode: 'b2',
                                elementPath: '/medias/Videos/video-dog.mov'
                            },
                            childs: []
                        }
                    ]
                },
                {
                    content: {
                        elementLabel: 'img',
                        idNode: '',
                        elementPath: '/medias/img'
                    },
                    childs: [
                        {
                            content: {
                                elementLabel: 'Animals.jpg',
                                idNode: 'c1',
                                elementPath: '/medias/img/Animals.jpg'
                            },
                            childs: []
                        },
                        {
                            content: {
                                elementLabel: 'Birds.jpeg',
                                idNode: 'c2',
                                elementPath: '/medias/img/Birds.jpeg'
                            },
                            childs: []
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
            childs: []
        },
        {
            content: {
                elementLabel: 'html',
                idNode: '',
                elementPath: '/html'
            },
            childs: [
                {
                    content: {
                        elementLabel: 'home.html',
                        idNode: 'j1',
                        elementPath: '/html/home.html'
                    },
                    childs: []
                },
                {
                    content: {
                        elementLabel: 'event.html',
                        idNode: 'j2',
                        elementPath: '/html/event.html'
                    },
                    childs: []
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
