import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './table.html?style=./table.scss';
import { TABLE_NAME } from '../component-names';

const HEADER: string = 'header';
const HEADER_CONTENT_LEFT: string = 'header-content-left';
const HEADER_CONTENT_RIGHT: string = 'header-content-right';

@WithRender
@Component
export class MTable extends Vue {

    public componentName: string = TABLE_NAME;
    @Prop({ default: false })
    public withOptionMenu: boolean;

    private get hasHeader(): boolean {
        if (this.$slots[HEADER] || this.$slots[HEADER_CONTENT_LEFT] || this.$slots[HEADER_CONTENT_RIGHT]) {
            return true;
        }
        return false;
    }

    private get hasContentLeft(): boolean {
        return !!this.$slots[HEADER_CONTENT_LEFT];
    }

    private get hasContentRight(): boolean {
        return !!this.$slots[HEADER_CONTENT_RIGHT];
    }
}

const TablePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
