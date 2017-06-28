import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './template.html?style=./template.scss';
import { TEMPLATE_NAME } from '../component-names';

@WithRender
@Component
export class Mtemplate extends Vue {
    @Prop({ default: false })
    public hasFooterFullWidth: boolean;

    private propsHasFooterFullWidth: boolean = false;

    private beforeMount(): void {
        this.updateFooterWidth(this.hasFooterFullWidth);
    }

    @Watch('hasFooterFullWidth')
    private updateFooterWidth(newValue: boolean): void {
        this.propsHasFooterFullWidth = newValue;
    }

    public get hasColumn(): boolean {
        return !!this.$slots['column'];
    }

    public get hasFooter(): boolean {
        return !!this.$slots['footer'];
    }
}

const Template: PluginObject<any> = {
    install(v, options) {
        v.component(TEMPLATE_NAME, Mtemplate);
    }
};

export default Template;
