import { PluginObject } from 'vue';
import { ListComponent, LIST_NAME } from './list';

const lists: PluginObject<any> = {
    install(v, options) {
        v.component(LIST_NAME, ListComponent);
    }
};

export default lists;
