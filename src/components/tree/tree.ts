import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MNodeStructureArchive } from '../root-tree/root-tree';
import WithRender from './tree.html?style=./tree.scss';

const FOLDER_OPEN: string = 'm-svg__file-odf';
const FOLDER_CLOSED: string = 'm-svg__file-odb';

@WithRender
@Component
export class MTree extends ModulVue {

    @Prop()
    tree: MNodeStructureArchive[];

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    @Prop()
    icon: string;

    @Prop()
    openFolders: string[];

    internalSelectedFile: MNodeStructureArchive[] = [];

    created(): void {
        // this.internalSelectedFile = this.externalSelectedFile;
    }

    isAFolder(idFile: string): boolean {
        return !idFile;
    }

    extensionFile(filename: string = ''): string {
        let extension: string = filename.split('.').pop() as string;
        return '.' + extension;
    }

    isFileSelected(file: MNodeStructureArchive): boolean {
        return !!file.idFile && this.externalSelectedFile[0].idFile === file.idFile;
    }

    selectFile(file: MNodeStructureArchive): void {
        this.$emit('selectFile', file);
    }

    folderIcon($event): string {
        return FOLDER_CLOSED;
    }

    isFolderOpen(relativePath: string): boolean | void {
        console.log(relativePath);
        if (relativePath === '/Dossier #1/Dossier #2') {
            console.log(this.openFolders.indexOf(relativePath));
        }
        if (this.openFolders !== undefined && this.openFolders.length && this.openFolders.indexOf(relativePath) !== -1) {
            // this.$emit('test');
            // console.log(this.openFolders);
            return true;
        }
    }

    // @Watch('externalSelectedFile')
    // test(): void {
    //     console.log(this.externalSelectedFile);
    // }

    // isFolderOpen(relativePath: string): boolean {
    //     if (this.currentSelectedFile.indexOf(relativePath) === -1) {
    //         return true;
    //     }
    //     return true;
    // }

    // get currentSelectedFile(): string {
    //     return this.internalSelectedFile;
    // }

    // set currentSelectedFile(relativePath: string) {
    //     this.internalSelectedFile = relativePath;
    //     this.$emit('update:externalSelectedFile', this.internalSelectedFile);
    // }

    // @Watch('externalSelectedFile')
    // initializeSelectedFile(): void {
    //     this.currentSelectedFile = this.externalSelectedFile;
    // }

}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.component(TREE_NAME, MTree);
    }
};

export default TreePlugin;
