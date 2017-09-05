import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './content-list.html?style=./content-list.scss';
import { CONTENT_LIST_NAME } from '../component-names';
import { ElementQueries } from '../../mixins/element-queries/element-queries';

export interface MContentListInterface extends ModulVue {
    deletedItem: any;
    sizeSmall: boolean;
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MContentList extends ModulVue implements MContentListInterface {
    public componentName = CONTENT_LIST_NAME;

    public deletedItem = '';
    public sizeSmall: boolean;

    protected mounted(): void {
        this.isEqMaxXSChanged(this.as<ElementQueries>().isEqMaxXS);
        this.$on('isEqMaxXS', (value: boolean) => this.isEqMaxXSChanged(value));
    }

    private isEqMaxXSChanged(value: boolean) {
        this.$emit('isSizeSmall', value);
    }

    private get hasHeader(): boolean {
        if (this.$slots['header']) {
            return true;
        }
        return false;
    }

    @Watch('deletedItem')
    private deletedChildElement(value): void {
        this.$emit('deletedItem', this.deletedItem);
    }
}

const ContentListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_NAME, MContentList);
    }
};

export default ContentListPlugin;
