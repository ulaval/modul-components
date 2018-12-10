import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { extractExtension } from '../../../utils/file/file';
import { ModulVue } from '../../../utils/vue/vue';
import IconFilePlugin from '../../icon-file/icon-file';
import IconPlugin from '../../icon/icon';
import PlusPlugin from '../../plus/plus';
import { TREE_ICON_NAME } from '../component-names';
import { MIconsSet } from '../tree';
import WithRender from './tree-icon.html?style=./tree-icon.scss';

const FOLDER_OPEN: string = 'm-svg__folder-open';
const FOLDER_CLOSED: string = 'm-svg__folder';

@WithRender
@Component
export class MTreeIcon extends ModulVue {
    @Prop()
    public filename: string;

    @Prop()
    public isFolder: boolean;

    @Prop()
    public isFolderOpen: boolean;

    @Prop()
    public iconsSet: MIconsSet;

    public get propIconsSet(): MIconsSet {
        return this.iconsSet || MIconsSet.Folder;
    }

    public get folderIcon(): string {
        return this.isFolderOpen ? FOLDER_OPEN : FOLDER_CLOSED;
    }

    public get extensionFile(): string {
        return '.' + extractExtension(this.filename);
    }
}

const TreeIconPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_ICON_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.use(IconPlugin);
        v.use(PlusPlugin);
        v.component(TREE_ICON_NAME, MTreeIcon);
    }
};

export default TreeIconPlugin;
