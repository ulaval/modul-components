import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './list.html?style=./list.scss';
import { LIST_NAME } from '../component-names';

@WithRender
@Component
export class MList extends Vue {
    public get values(): string[] {
        return ['v1', 'v3', 'v3'];
    }
}

const ListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIST_NAME, MList);
    }
};

export default ListPlugin;
