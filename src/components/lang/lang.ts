import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './lang.html';
import { I18N_NAME } from '../component-names';
import { ModulVue } from '../../utils/vue';

@WithRender
@Component
export class MLang extends ModulVue {
    public text: string = '';

    @Prop()
    public msg: string;

    public mounted() {
        this.text = this.$i18n.translate(this.msg);
    }
}

const LangPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(I18N_NAME, MLang);
    }
};

export default LangPlugin;
