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
export class MFileTree extends ModulVue {

    @Prop()
    public file: MTreeFormat;

    @Prop({ default: false })
    public folder: boolean;

    @Prop({ default: false })
    public folderOpen: boolean;

    public get folderIcon(): string {
        return this.folderOpen ? FOLDER_OPEN : FOLDER_CLOSED;
    }

    public get extensionFile(): string {
        return '.' + this.file.nodeId.split('.').pop() as string;
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
