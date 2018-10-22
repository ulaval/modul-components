import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_EMPTY_NAME } from '../../component-names';
import WithRender from './table-empty.html';

@WithRender
@Component
export class MTableEmpty extends ModulVue {

    @Prop()
    columns: number;

    public i18nEmptyData: string = this.$i18n.translate('m-table-empty:empty');

    public get hasSlot(): boolean {
        return !!this.$slots.default;
    }

}

const TableEmptyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_EMPTY_NAME, 'plugin.install');
        v.component(TABLE_EMPTY_NAME, MTableEmpty);
    }
};

export default TableEmptyPlugin;
