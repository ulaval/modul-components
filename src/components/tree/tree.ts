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

    folderIcon(): string {
        return FOLDER_CLOSED;
    }

    isFolderOpen(relativePath: string): boolean | void {
        if (this.openFolders !== undefined && this.openFolders.length && this.openFolders.indexOf(relativePath) !== -1) {
            return true;
        }
    }

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
