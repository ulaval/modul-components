import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './i18n.html';
import { I18N_NAME } from '../component-names';
import { ModulVue } from '../../utils/vue';

@WithRender
@Component
export class MLang extends ModulVue {
    @Prop()
    public i18nKey: string;

    public componentName: string = I18N_NAME;
    public text: string = '';

    public mounted(): void {
        this.translate();
    }

    @Watch('i18nKey')
    public onMessageKeyChanged() {
        this.translate();
    }

    private translate(): void {
        if (this.i18nKey) {
            this.text = this.$i18n.translate(this.i18nKey);
        }
    }
}

const LangPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(I18N_NAME, MLang);
    }
};

export default LangPlugin;
