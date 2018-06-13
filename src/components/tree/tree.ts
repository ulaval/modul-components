import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { TREE_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import WithRender from './tree.html';

@WithRender
@Component
export class MTree extends ModulVue {

}

const TreePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TREE_NAME, 'plugin.install');
        v.use(IconFilePlugin);
        v.component(TREE_NAME, MTree);
    }
};

export default TreePlugin;
