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
            relativePath: '/1chemin-vers-le-fichier.html',
            childs: []
        },
        {
            fileName: 'Fichier #2',
            idFile: 'b1',
            relativePath: '/2chemin-vers-le-fichier.jpeg',
            childs: [
                {
                    fileName: 'Fichier #2-1',
                    idFile: 'b2',
                    relativePath: '/3chemin-vers-le-fichier.doc',
                    childs: []
                },
                {
                    fileName: 'Fichier #2-2',
                    idFile: 'b3',
                    relativePath: '/4chemin-vers-le-fichier.xls',
                    childs: []
                },
                {
                    fileName: 'Fichier #2-3',
                    idFile: 'b4',
                    relativePath: '/5chemin-vers-le-fichier.jpg',
                    childs: [
                        {
                            fileName: 'Fichier #2-3-1',
                            idFile: 'b5',
                            relativePath: '/6chemin-vers-le-fichier.js',
                            childs: []
                        },
                        {
                            fileName: 'Fichier #2-3-2',
                            idFile: 'b6',
                            relativePath: '/7chemin-vers-le-fichier.css',
                            childs: []
                        }
                    ]
                }
            ]
        },
        {
            fileName: 'Fichier #3',
            idFile: 'c1',
            relativePath: '/8chemin-vers-le-fichier.mp4',
            childs: [
                {
                    fileName: 'Fichier #3-1',
                    idFile: 'c2',
                    relativePath: '/9chemin-vers-le-fichier.css',
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
