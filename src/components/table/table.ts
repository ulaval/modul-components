import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './table.html?style=./table.scss';
import { TABLE_NAME } from '../component-names';
import MenuPlugin from '../options-menu/options-menu';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';

export enum MTableHeaderPosition {
    Left = 'left',
    Right = 'right'
}

const HEADER: string = 'header';

@WithRender
@Component
export class MTable extends Vue {

    @Prop({ default: false })
    public withOptionsMenu: boolean;
    @Prop({ default: false })
    public demo: boolean;

    public componentName: string = TABLE_NAME;

    private get hasHeader(): boolean {
        if (this.$slots[HEADER] || this.$slots[MTableHeaderPosition.Left] || this.$slots[MTableHeaderPosition.Right]) {
            return true;
        }
        return false;
    }

    private get hasContentLeft(): boolean {
        return !!this.$slots[MTableHeaderPosition.Left];
    }

    private get hasContentRight(): boolean {
        return !!this.$slots[MTableHeaderPosition.Right];
    }
}

const TablePlugin: PluginObject<any> = {
    install(v, options) {
        v.use(MenuPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
