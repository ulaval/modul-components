import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SELECT_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import { MSelectItem } from './select-item/select-item';
import WithRender from './select.html?style=./select.scss';


@WithRender
@Component({
    components: {
        MSelectItem
    },
    mixins: [
        InputState,
        InputPopup,
        MediaQueries,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MSelect extends ModulVue {

    @Model('change')
    @Prop()
    public value: any;

    @Prop()
    public options: [];

    @Prop()
    public textNoData: string;

    private id: string = `${SELECT_NAME}-${uuid.generate()}`;


    private get ariaControls(): string {
        return this.id + '-controls';
    }

    private get hasItems(): boolean {
        return this.options && this.options.length > 0;
    }

    private get propTextNoData(): string {
        return (this.textNoData ? this.textNoData : this.$i18n.translate('m-select:no-data'));
    }
}
const SelectPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(I18nPlugin);
        v.component(SELECT_NAME, MSelect);
    }
};

export default SelectPlugin;
