import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './template.html?style=./template.scss';
import { TEMPLATE_NAME } from '../component-names';
import { ElementQueries } from '../../mixins/element-queries/element-queries';

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class Mtemplate extends Vue {
    @Prop()
    public footerFullWidth: boolean;

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasSubHeaderSlot(): boolean {
        return !!this.$slots.subHeader;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasColumnSlot(): boolean {
        return !!this.$slots.column;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const TemplatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(TEMPLATE_NAME, Mtemplate);
    }
};

export default TemplatePlugin;
