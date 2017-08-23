import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './content-list-item.html?style=./content-list-item.scss';
import { CONTENT_LIST_ITEM_NAME } from '../component-names';

@WithRender
@Component
export class MContentListItem extends ModulVue {
    public componentName = CONTENT_LIST_ITEM_NAME;

    @Prop({ default: false })
    public button: boolean;

    // private get hasBouton(): boolean {
    //     if (this.button) {
    //         return true;
    //     }
    //     return false;
    // }

    private deleteItem() {
        console.log('delete');
    }

}

const ContentListItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_ITEM_NAME, MContentListItem);
    }
};

export default ContentListItemPlugin;
