import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './content-list.html?style=./content-list.scss';
import { CONTENT_LIST_NAME } from '../component-names';

@WithRender
@Component
export class MContentList extends Vue {
    public componentName = CONTENT_LIST_NAME;

    private get hasHeader(): boolean {
        if (this.$slots['header']) {
            return true;
        }
        return false;
    }
}

const ContentListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_NAME, MContentList);
    }
};

export default ContentListPlugin;
