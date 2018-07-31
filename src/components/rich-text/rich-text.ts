import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_NAME } from '../component-names';
import WithRender from './rich-text.html?style=./rich-text.scss';

@WithRender
@Component
export class MRichText extends ModulVue {
    @Prop({ default: '' })
    public value: string;
}

const RichTextPlugin: PluginObject<any> = {
    install(v): void {
        v.component(RICH_TEXT_NAME, RichTextPlugin);
    }
};

export default RichTextPlugin;
