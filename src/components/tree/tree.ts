import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MNodeStructureArchive } from '../root-tree/root-tree';
import WithRender from './tree.html?style=./tree.scss';

@WithRender
@Component
export class MTree extends ModulVue {

    @Prop()
    tree: MNodeStructureArchive[];

    @Prop()
    externalSelectedFile: MNodeStructureArchive[];

    @Prop()
    icon: string;

    internalSelectedFile: string = '';

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
