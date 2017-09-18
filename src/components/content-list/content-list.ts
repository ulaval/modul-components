import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './content-list.html?style=./content-list.scss';
import { CONTENT_LIST_NAME } from '../component-names';
import { ElementQueries } from '../../mixins/element-queries/element-queries';

export interface MContentListInterface extends ModulVue {
    sizeSmall: boolean;
    deleteChildElement(index: any): void;
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MContentList extends ModulVue implements MContentListInterface {
    public componentName = CONTENT_LIST_NAME;
    public sizeSmall: boolean;

    public deleteChildElement(index): void {
        this.$emit('ItemDeleted', index);
    }

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
}

const ContentListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_NAME, MContentList);
    }
};

export default ContentListPlugin;
