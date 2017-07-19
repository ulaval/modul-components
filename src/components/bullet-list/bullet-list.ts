import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './bullet-list.html?style=./bullet-list.scss';
import { BULLET_LIST_NAME } from '../component-names';

@WithRender
@Component
export class MBulletList extends Vue {
    @Prop({ default: () => ['Element 1', 'Element 2', 'Element 3'] })
    public values: string[];

    public componentName = BULLET_LIST_NAME;
}

const BulletListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BULLET_LIST_NAME, MBulletList);
    }
};

export default BulletListPlugin;
