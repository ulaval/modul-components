import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import WithRender from './tree.html?style=./tree.scss';

export interface MNodeStructureArchive {
    relativePath: string;
    idFile: string;
    fileName: string;
    childs: MNodeStructureArchive[];
}

export enum MSelectOption {
    NONE = 0,
    SINGLE = 1,
    MULTIPLE = 2
}

@WithRender
@Component
export class MTree extends ModulVue {

    @Prop()
    tree: MNodeStructureArchive[];

    @Prop({
        default: MSelectOption.NONE,
        validator: value =>
            value === MSelectOption.NONE ||
            value === MSelectOption.SINGLE ||
            value === MSelectOption.MULTIPLE
    })
    selection: MSelectOption;

    @Prop()
    selectedFile: string;

    @Prop()
    icon: string;

    relativePathSelected: string = '';

    created(): void {
        this.currentSelectedFile = this.selectedFile;
    }

    haveChilds(child: MNodeStructureArchive[]): boolean {
        return child.length ? true : false;
    }

    extensionFile(filename: string = ''): string {
        let extension: string = filename.split('.').pop() as string;
        return '.' + extension;
    }

    selectFile(file: MNodeStructureArchive): void {
        this.currentSelectedFile = file.relativePath;
    }

    isFileSelected(relativePath: string): boolean {
        return this.currentSelectedFile === relativePath;
    }

    get currentSelectedFile(): string {
        return this.relativePathSelected;
    }

    set currentSelectedFile(relativePath: string) {
        this.relativePathSelected = relativePath;
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
