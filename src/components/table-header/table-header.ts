import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { TABLE_HEADER_NAME } from '../component-names';
import { MIconButtonSkin } from '../icon-button/icon-button';
import WithRender from './table-header.html?style=./table-header.scss';
import LinkPlugin from '../link/link';

@WithRender
@Component
export class MTableHeader extends ModulVue {
    @Prop()
    addBtnLabel: string;

    addButtonSkin: MIconButtonSkin = MIconButtonSkin.Link;

    @Emit('add')
    add(): void {
    }
}

const TableHeaderPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(LinkPlugin);
        v.component(TABLE_HEADER_NAME, MTableHeader);
    }
};

export default TableHeaderPlugin;
