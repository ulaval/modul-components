import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './list-bullet.html?style=./list-bullet.scss';
import { LIST_BULLET_NAME } from '../component-names';

@WithRender
@Component
export class MListBullet extends Vue {
    @Prop({ default: ['Element 1', 'Element 2', 'Element 3'] })
    public values: string[];
    private componentName = LIST_BULLET_NAME;
}

const ListBulletPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIST_BULLET_NAME, MListBullet);
    }
};

export default ListBulletPlugin;
