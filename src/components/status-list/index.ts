import { PluginObject } from 'vue';
import { MStatusList } from './status-list';
import { STATUS_LIST_NAME } from '../component-names';

export class StatusList implements PluginObject<any> {
    public install(v, options) {
        v.component(STATUS_LIST_NAME, MStatusList);
    }
}

export default new StatusList();
