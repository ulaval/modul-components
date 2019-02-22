import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { LIST_ITEM_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import SpinnerPlugin from '../spinner/spinner';
import WithRender from './list-item.html?style=./list-item.scss';

@WithRender
@Component
export class MListItem extends Vue {

    @Prop()
    public iconName: string;
    @Prop()
    public iconHiddenText: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;
    @Prop({ default: false })
    public fullWidth: boolean;
    @Prop({ default: false })
    public fullHeight: boolean;
    @Prop({ default: false })
    public borderTop: boolean;
    @Prop({ default: false })
    public borderBottom: boolean;

    @Emit('click')
    click(event: Event): void { }

    private get hasIcon(): boolean {
        return this.iconName !== '' && this.iconName !== undefined;
    }

    private get isWaiting(): boolean {
        return this.waiting && !this.disabled;
    }

}

const ListItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconButtonPlugin);
        v.use(SpinnerPlugin);
        v.use(I18nPlugin);
        v.component(LIST_ITEM_NAME, MListItem);
    }
};

export default ListItemPlugin;
