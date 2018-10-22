import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_BODY_NAME } from '../../component-names';
import WithRender from './table-body.html';

@WithRender
@Component
export class MTableBody extends ModulVue {

    @Prop({ default: () => [] })
    rows: any[];

    @Prop()
    columns: number;

    public get isEmpty(): boolean {
        return !this.rows.length;
    }

}

const TableBodyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_BODY_NAME, 'plugin.install');
        v.component(TABLE_BODY_NAME, MTableBody);
    }
};

export default TableBodyPlugin;
