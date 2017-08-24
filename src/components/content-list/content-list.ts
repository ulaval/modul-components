import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './content-list.html?style=./content-list.scss';
import { CONTENT_LIST_NAME } from '../component-names';

export interface MContentListInterface extends ModulVue {
    deletedElement: any;
}

@WithRender
@Component
export class MContentList extends ModulVue implements MContentListInterface {
    public componentName = CONTENT_LIST_NAME;

    public deletedElement = '';

    private get hasHeader(): boolean {
        if (this.$slots['header']) {
            return true;
        }
        return false;
    }

    @Watch('deletedElement')
    private deletedChildElement(value): void {
        console.log('parent', this.deletedElement);
        this.$emit('contentListDeletedElement', this.deletedElement);

    }
}

const ContentListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_NAME, MContentList);
    }
};

export default ContentListPlugin;
