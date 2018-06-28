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
            fileName: 'Fichier #2-3-2-2',
            idFile: 'b9',
            relativePath: '/Dossier #1/Dossier #2/Dossier #3/10chemin-vers-le-fichier.doc',
            childs: []
        }
    ];

    public testArbo: MNodeStructureArchive[] = [
        {
            fileName: 'Fichier #1',
            idFile: 'a1',
            relativePath: '/Fichier #1',
            childs: []
        },
        {
            fileName: 'Dossier #1',
            idFile: '',
            relativePath: '/Dossier #1',
            childs: [
                {
                    fileName: 'Fichier #2-1',
                    idFile: 'b2',
                    relativePath: '/Dossier #1/3chemin-vers-le-fichier.doc',
                    childs: []
                },
                {
                    fileName: 'Fichier #2-2',
                    idFile: 'b3',
                    relativePath: '/Dossier #1/4chemin-vers-le-fichier.xls',
                    childs: []
                },
                {
                    fileName: 'Dossier #2',
                    idFile: '',
                    relativePath: '/Dossier #1/Dossier #2',
                    childs: [
                        {
                            fileName: 'Fichier #2-3-1',
                            idFile: 'b5',
                            relativePath: '/Dossier #1/Dossier #2/6chemin-vers-le-fichier-----------------------------.js',
                            childs: []
                        },
                        {
                            fileName: 'Fichier #2-3-2',
                            idFile: 'b6',
                            relativePath: '/Dossier #1/Dossier #2/7chemin-vers-le-fichier.css',
                            childs: []
                        },
                        {
                            fileName: 'Dossier #3',
                            idFile: '',
                            relativePath: '/Dossier #1/Dossier #2/Dossier #3',
                            childs: [
                                {
                                    fileName: 'Fichier #2-3-2-1',
                                    idFile: 'b8',
                                    relativePath: '/Dossier #1/Dossier #2/Dossier #3/9chemin-vers-le-fichier.js',
                                    childs: []
                                },
                                {
                                    fileName: 'Fichier #2-3-2-2',
                                    idFile: 'b9',
                                    relativePath: '/Dossier #1/Dossier #2/Dossier #3/10chemin-vers-le-fichier.doc',
                                    childs: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            fileName: 'Dossier #4',
            idFile: '',
            relativePath: '/Dossier #4',
            childs: [
                {
                    fileName: 'Fichier #4-1',
                    idFile: 'c2',
                    relativePath: '/Dossier #4/9chemin-vers-le-fichier.css',
                    childs: []
                }
            ]
        }
    ];
}

const RootTreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ROOT_TREE_NAME}-sandbox`, MRootTreeSandbox);
    }
};

export default RootTreeSandboxPlugin;
