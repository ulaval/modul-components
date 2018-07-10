import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT } from '../component-names';
import WithRender from './rich-text.html';

require('froala-editor/css/froala_editor.pkgd.min.css');

@WithRender
@Component
export class MRichText extends ModulVue {
    @Prop({ default: '' })
    public value: string;
}

const RichTextPlugin: PluginObject<any> = {
    install(v): void {
        v.component(RICH_TEXT, RichTextPlugin);
    }
};

export default RichTextPlugin;
