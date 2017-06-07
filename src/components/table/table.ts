import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './table.html?style=./table.scss';
import { TABLE_NAME } from '../component-names';

@WithRender
@Component
export class MTable extends Vue {

    private componentName: string = TABLE_NAME;

    public get hasHeader(): boolean {
        if (!!this.$slots['header'] || !!this.$slots['header-content-left'] || !!this.$slots['header-content-right']) {
            return true;
        }
        return false;
    }

    public get hasContentLeft(): boolean {
        return !!this.$slots['header-content-left'];
    }

    public get hasContentRight(): boolean {
        return !!this.$slots['header-content-right'];
    }
}

const TablePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
