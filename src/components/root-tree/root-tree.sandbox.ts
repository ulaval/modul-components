import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ROOT_TREE_NAME } from '../component-names';
import { MNodeStructureArchive } from './root-tree';
import WithRender from './root-tree.sandbox.html';

@WithRender
@Component
export class MRootTreeSandbox extends Vue {
    public currentFile: MNodeStructureArchive[] = [
        {
            fileName: 'nav.html',
            idFile: 'h1',
            relativePath: '/html/Footer/nav/nav.html',
            childs: []
        }
    ];

    public secondCurrentFile: MNodeStructureArchive[] = [
        {
            fileName: 'home.html',
            idFile: 'j1',
            relativePath: '/html/home.html',
            childs: []
        }
    ];

    public currentFileEmpty: MNodeStructureArchive[] = [];

    public emptyTree: MNodeStructureArchive[] = [];

    public fullTree: MNodeStructureArchive[] = [
        {
            fileName: 'index.html',
            idFile: 'a1',
            relativePath: '/index.html',
            childs: []
        },
        {
            fileName: 'Medias',
            idFile: '',
            relativePath: '/medias',
            childs: [
                {
                    fileName: 'Videos',
                    idFile: '',
                    relativePath: '/medias/Videos',
                    childs: [
                        {
                            fileName: 'video_cat.mp4',
                            idFile: 'b1',
                            relativePath: '/medias/video_cat.mp4',
                            childs: []
                        },
                        {
                            fileName: 'video-dog.mov',
                            idFile: 'b2',
                            relativePath: '/medias/video-dog.mov',
                            childs: []
                        }
                    ]
                },
                {
                    fileName: 'img',
                    idFile: '',
                    relativePath: '/medias/img',
                    childs: [
                        {
                            fileName: 'Animals.jpg',
                            idFile: 'c1',
                            relativePath: '/medias/img/Animals.jpg',
                            childs: []
                        },
                        {
                            fileName: 'Birds.jpeg',
                            idFile: 'c2',
                            relativePath: '/medias/img/Birds.jpeg',
                            childs: []
                        }
                    ]
                }
            ]
        },
        {
            fileName: 'scss',
            idFile: '',
            relativePath: '/scss',
            childs: [
                {
                    fileName: 'css',
                    idFile: '',
                    relativePath: '/scss/css',
                    childs: [
                        {
                            fileName: 'home.css',
                            idFile: 'd1',
                            relativePath: '/scss/css/home.css',
                            childs: []
                        },
                        {
                            fileName: 'newsletter.css',
                            idFile: 'd2',
                            relativePath: '/scss/css/newsletter.css',
                            childs: []
                        },
                        {
                            fileName: 'news.css',
                            idFile: 'd3',
                            relativePath: '/scss/css/news.css',
                            childs: []
                        },
                        {
                            fileName: 'event.css',
                            idFile: 'd4',
                            relativePath: '/scss/css/event.css',
                            childs: []
                        },
                        {
                            fileName: 'footer.css',
                            idFile: 'd5',
                            relativePath: '/scss/css/footer.css',
                            childs: []
                        },
                        {
                            fileName: 'header.css',
                            idFile: 'd6',
                            relativePath: '/scss/css/header.css',
                            childs: []
                        },
                        {
                            fileName: 'svg',
                            idFile: '',
                            relativePath: '/scss/css/svg',
                            childs: [
                                {
                                    fileName: 'icon.svg',
                                    idFile: 'e1',
                                    relativePath: '/scss/css/img/icon.svg',
                                    childs: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            fileName: 'Empty',
            idFile: '',
            relativePath: '/Empty',
            childs: []
        },
        {
            fileName: 'html',
            idFile: '',
            relativePath: '/html',
            childs: [
                {
                    fileName: 'home.html',
                    idFile: 'j1',
                    relativePath: '/html/home.html',
                    childs: []
                },
                {
                    fileName: 'event.html',
                    idFile: 'j2',
                    relativePath: '/html/event.html',
                    childs: []
                },
                {
                    fileName: 'Header',
                    idFile: '',
                    relativePath: '/html/Header',
                    childs: [
                        {
                            fileName: 'nav',
                            idFile: '',
                            relativePath: '/html/Header/nav',
                            childs: [
                                {
                                    fileName: 'nav.html',
                                    idFile: 'f1',
                                    relativePath: '/html/Header/nav/nav.html',
                                    childs: []
                                }
                            ]
                        },
                        {
                            fileName: 'title',
                            idFile: '',
                            relativePath: '/html/Header/title',
                            childs: [
                                {
                                    fileName: 'title.html',
                                    idFile: 'g1',
                                    relativePath: '/html/Header/nav/title.html',
                                    childs: []
                                }
                            ]
                        }
                    ]
                },
                {
                    fileName: 'news.html',
                    idFile: 'j3',
                    relativePath: '/html/news.html',
                    childs: []
                },
                {
                    fileName: 'Footer',
                    idFile: '',
                    relativePath: '/html/Footer',
                    childs: [
                        {
                            fileName: 'nav',
                            idFile: '',
                            relativePath: '/html/Footer/nav',
                            childs: [
                                {
                                    fileName: 'nav.html',
                                    idFile: 'h1',
                                    relativePath: '/html/Footer/nav/nav.html',
                                    childs: []
                                }
                            ]
                        },
                        {
                            fileName: 'copyright',
                            idFile: '',
                            relativePath: '/html/Footer/copyright',
                            childs: [
                                {
                                    fileName: 'copyright.html',
                                    idFile: 'i1',
                                    relativePath: '/html/Footer/nav/copyright.html',
                                    childs: []
                                }
                            ]
                        }
                    ]
                },
                {
                    fileName: 'newsletter.html',
                    idFile: 'j4',
                    relativePath: '/html/newsletter.html',
                    childs: []
                }
            ]
        }
    ];

    public selectNewFile(file: MNodeStructureArchive): void {
        console.log(file);
        console.log('Ça passe');
    }

}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ROOT_TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
