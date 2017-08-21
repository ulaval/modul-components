import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './bullet-list.html?style=./bullet-list.scss';
import { BULLET_LIST_NAME } from '../component-names';

@WithRender
@Component
export class MBulletList extends Vue {
    @Prop()
    public title: string;

    public componentName = BULLET_LIST_NAME;

    private get hasTitile(): boolean {
        return this.title == undefined || this.title == '' ? false : true;
    }
}

const BulletListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BULLET_LIST_NAME, MBulletList);
    }
};

export default BulletListPlugin;
