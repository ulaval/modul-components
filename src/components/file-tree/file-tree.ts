import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { FILE_TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from '../icon/icon';
import { MTreeFormat } from '../tree/tree';
import WithRender from './file-tree.html';

const FOLDER_OPEN: string = 'm-svg__file-openoffice-math';
const FOLDER_CLOSED: string = 'm-svg__file-zip';
@WithRender
@Component
export class MFileTree<T extends MTreeFormat> extends ModulVue {

    @Prop()
    file: MTreeFormat;

    @Prop({ default: false })
    folderOpen: boolean;

    @Prop({ default: false })
    folder: boolean;

    get folderIcon(): string {
        return this.folderOpen ? FOLDER_OPEN : FOLDER_CLOSED;
    }

    get extensionFile(): string {
        return '.' + this.file.idNode.split('.').pop() as string;
    }

}

const FileTreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(FILE_TREE_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.component(FILE_TREE_NAME, MFileTree);
    }
};

export default FileTreePlugin;
