import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './list-bullet.html?style=./list-bullet.scss';
import { LIST_NAME } from '../component-names';

@WithRender
@Component
export class MList extends Vue {
    @Prop({ default: ['Element 1', 'Element 2', 'Element 3'] })
    public values: string[];
    private componentName = LIST_NAME;
}

const ListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIST_NAME, MList);
    }
};

export default ListPlugin;
