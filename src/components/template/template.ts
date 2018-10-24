import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { TEMPLATE_NAME } from '../component-names';
import WithRender from './template.html?style=./template.scss';

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MTemplate extends Vue {
    @Prop()
    public footerFullWidth: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
}

const TemplatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(TEMPLATE_NAME, MTemplate);
    }
};

export default TemplatePlugin;
