import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dynamic-template.html';
import uuid from '../../utils/uuid/uuid';
import { DYNAMIC_TEMPLATE_NAME } from '../component-names';

@WithRender
@Component
export class MDynamicTemplate extends Vue {
    @Prop()
    public template: string;

    public internalTemplate: string = '';

    private tag: string = 'm-dt-' + uuid.generate();

    public mounted(): void {
        this.renderTemplate();
    }

    @Watch('template')
    public onTemplate() {
        this.renderTemplate();
    }

    private renderTemplate(): void {
        Vue.component(this.tag, {
            template: '<div>' + this.template + '</div>'
        });
        this.internalTemplate = '';
        this.internalTemplate = this.tag;
    }
}

const DynamicTemplatePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DYNAMIC_TEMPLATE_NAME, MDynamicTemplate);
    }
};

export default DynamicTemplatePlugin;
