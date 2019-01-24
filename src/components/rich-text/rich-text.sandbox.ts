import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import RichTextPlugin, { MRichText } from './rich-text';
import WithRender from './rich-text.sandbox.html';

@WithRender
@Component({
    components: { MRichText }
})
export class MRichTextSandBox extends Vue {
    public model: string = '<p><strong>texte gras.</strong></p><p><em>texte italique.</em><p/><p><sub>texte indice.</sub></p><p><sup>texte exposant.</sup></p><p><br></p><p>liste à puces :</p><ul><li>élément<ul><li>sous-élément</li><li>sous-élément</li></ul></li><li>élément</li><li>élément</li></ul><p><br></p><p>liste numérotée :</p><ol><li>élément<ol><li>sous-élément</li><li>sous-élément</li></ol></li><li>élément</li><li>élément</li></ol><p><br></p><p style="margin-left: 80px;">texte indenté</p><p><a href="http://google.com">lien vers google</a></p><p><br></p><p>caractères spéciaux: ÃΥθи</p>';
}

const RichTextSandBoxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(RichTextPlugin);
        v.component(`m-rich-text-sandbox`, MRichTextSandBox);
    }
};

export default RichTextSandBoxPlugin;
