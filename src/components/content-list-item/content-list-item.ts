import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './content-list-item.html?style=./content-list-item.scss';
import { CONTENT_LIST_ITEM_NAME } from '../component-names';
import { MContentList, MContentListInterface } from '../content-list/content-list';
import { TransitionAccordion } from '../../mixins/transition-accordion/transition-accordion';
import { ElementQueries } from '../../mixins/element-queries/element-queries';

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MContentListItem extends ModulVue {
    public componentName = CONTENT_LIST_ITEM_NAME;

    @Prop({ default: false })
    public deleteButton: boolean;
    @Prop()
    public index: number;

    private visible: boolean = true;
    private ramdomId: any = 0;
    private internalIsEqMaxXS: boolean = false;
    private parentContentList: MContentListInterface;

    protected mounted(): void {
        this.parentContentList = this.$parent as MContentListInterface;
        this.parentContentList.$on('isSizeSmall', (value: boolean) => this.isEqMaxXS = value);
    }

    protected destroyed(): void {
        this.parentContentList.$off('isSizeSmall');
    }

    private deleteItem() {
        this.visible = false;
        this.parentContentList.deleteChildElement(this.index);
    }

    private get isEqMaxXS(): boolean {
        return this.internalIsEqMaxXS;
    }

    private set isEqMaxXS(value: boolean) {
        this.internalIsEqMaxXS = value;
    }
}

const ContentListItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CONTENT_LIST_ITEM_NAME, MContentListItem);
    }
};

export default ContentListItemPlugin;
