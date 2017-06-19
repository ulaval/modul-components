import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './i18n.html';
import { I18N_NAME } from '../component-names';
import { ModulVue } from '../../utils/vue';

@WithRender
@Component
export class MI18n extends ModulVue {
    @Prop()
    public i18nKey: string;

    public text: string = '';

    public created(): void {
        if (!this.$i18n) {
            throw new Error('MI18n -> this.$i18n is undefined, you must register the i18n plugin.');
        }
    }

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
        } else {
            this.text = '';
        }
    }
}

const I18nPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(I18N_NAME, MI18n);
    }
};

export default I18nPlugin;
