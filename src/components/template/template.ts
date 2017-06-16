import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './template.html?style=./template.scss';
import { TEMPLATE_NAME } from '../component-names';

@WithRender
@Component

export class Mtemplate extends Vue {
    @Prop()
    public title: string;

    private mounted(): void {
        console.log(this.$slots);
    }

    public get hasColumn(): boolean {
        return !!this.$slots['column'];
    }
}

const Template: PluginObject<any> = {
    install(v, options) {
        v.component(TEMPLATE_NAME, Mtemplate);
    }
};

export default Template;
