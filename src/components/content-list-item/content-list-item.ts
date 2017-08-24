import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './content-list-item.html?style=./content-list-item.scss';
import { CONTENT_LIST_ITEM_NAME } from '../component-names';
import { MContentListInterface } from '../content-list/content-list';

@WithRender
@Component
export class MContentListItem extends ModulVue {
    public componentName = CONTENT_LIST_ITEM_NAME;

    @Prop({ default: false })
    public button: boolean;
    @Prop()
    public index: number;

    private visible: boolean = true;
    private ramdomId: any = 0;

    private deleteItem() {
        this.visible = false;
        console.log('delete item', this.index);
        (this.$parent as MContentListInterface).deletedElement = this.index;
    }

}

const ContentListItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_ITEM_NAME, MContentListItem);
    }
};

export default ContentListItemPlugin;
