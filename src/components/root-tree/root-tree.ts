import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ROOT_TREE_NAME } from '../component-names';
import TreePlugin from '../tree/tree';
import WithRender from './root-tree.html';

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
export class MRootTree extends ModulVue {

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
    icon: string;

    @Prop()
    externalSelectedFile: string;

    @Prop()
    initialiseFolders: boolean;

    created(): void {
        console.log(this.tree);
    }

}

const RootTreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ROOT_TREE_NAME, 'plugin.install');
        v.use(TreePlugin);
        v.component(ROOT_TREE_NAME, MRootTree);
    }
};

export default RootTreePlugin;
