import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TREE_NAME } from '../component-names';
import { MNodeStructureArchive } from './tree';
import WithRender from './tree.sandbox.html';

@WithRender
@Component
export class MTreeSandbox extends Vue {

    public testArbo: MNodeStructureArchive[] = [
        {
            fileName: 'Fichier #1',
            idFile: 'a1',
            relativePath: '/chemin-vers-le-fichier.html',
            childs: []
        },
        {
            fileName: 'Fichier #2',
            idFile: 'b1',
            relativePath: '/chemin-vers-le-fichier.html',
            childs: [
                {
                    fileName: 'Fichier #2-1',
                    idFile: 'b2',
                    relativePath: '/chemin-vers-le-fichier.js',
                    childs: []
                },
                {
                    fileName: 'Fichier #2-2',
                    idFile: 'b3',
                    relativePath: '/chemin-vers-le-fichier.css',
                    childs: []
                },
                {
                    fileName: 'Fichier #2-3',
                    idFile: 'b4',
                    relativePath: '/chemin-vers-le-fichier.jpg',
                    childs: [
                        {
                            fileName: 'Fichier #2-3-1',
                            idFile: 'b5',
                            relativePath: '/chemin-vers-le-fichier.js',
                            childs: []
                        },
                        {
                            fileName: 'Fichier #2-3-2',
                            idFile: 'b6',
                            relativePath: '/chemin-vers-le-fichier.css',
                            childs: []
                        }
                    ]
                }
            ]
        },
        {
            fileName: 'Fichier #3',
            idFile: 'c1',
            relativePath: '/chemin-vers-le-fichier',
            childs: [
                {
                    fileName: 'Fichier #3-1',
                    idFile: 'c2',
                    relativePath: '/chemin-vers-le-fichier.css',
                    childs: []
                }
            ]
        }
    ];
}

const TreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MTreeSandbox);
    }
};

export default TreeSandboxPlugin;
