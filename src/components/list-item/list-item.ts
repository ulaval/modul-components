import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './list-item.html?style=./list-item.scss';
import { LIST_ITEM_NAME } from '../component-names';
import { TransitionAccordion } from '../../mixins/transition-accordion/transition-accordion';
import ButtonPlugin from '../button/button';
import SpinnerPlugin from '../spinner/spinner';
import I18nPlugin from '../i18n/i18n';

@WithRender
@Component
export class MListItem extends ModulVue {

    @Prop({ default: true })
    public deleteButton: boolean;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;

    private visible: boolean = true;

    private toDelete(event): void {
        this.$emit('delete', event);
    }

    private get isWaiting() {
        if (this.disabled === true && this.waiting === true) {
            return false;
        } else if ( this.waiting === true) {
            return true;
        } else {
            return false;
        }
    }

}

const ListItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(ButtonPlugin);
        v.use(SpinnerPlugin);
        v.use(I18nPlugin);
        v.component(LIST_ITEM_NAME, MListItem);
    }
};

export default ListItemPlugin;
