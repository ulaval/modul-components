import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './list-item.html?style=./list-item.scss';
import { LIST_ITEM_NAME } from '../component-names';
import { TransitionAccordion } from '../../mixins/transition-accordion/transition-accordion';

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MListItem extends ModulVue {
    public componentName = LIST_ITEM_NAME;

    @Prop({ default: true })
    public deleteButton: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public waiting: boolean;

    private visible: boolean = true;

    // public beforeDestroy(): void {
    //     this.visible = false;
    // }

    private toDelete(event): void {
        this.$emit('toDelete', event);
        console.log('toDelete', event);
    }

}

const ListItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIST_ITEM_NAME, MListItem);
    }
};

export default ListItemPlugin;
