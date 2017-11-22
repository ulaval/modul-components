import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './list-item.html?style=./list-item.scss';
import { LIST_ITEM_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import SpinnerPlugin from '../spinner/spinner';
import I18nPlugin from '../i18n/i18n';

@WithRender
@Component
export class MListItem extends Vue {

    @Prop({ default: true })
    public deleteButton: boolean;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;

    private toDelete(event): void {
        this.$emit('delete', event);
    }

    private get isWaiting() {
        return this.waiting && !this.disabled;
    }

}

const ListItemPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(LIST_ITEM_NAME, 'plugin.install');
        v.use(IconButtonPlugin);
        v.use(SpinnerPlugin);
        v.use(I18nPlugin);
        v.component(LIST_ITEM_NAME, MListItem);
    }
};

export default ListItemPlugin;
