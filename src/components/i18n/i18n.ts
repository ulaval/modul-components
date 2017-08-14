import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './i18n.html';
import { I18N_NAME } from '../component-names';
import { ModulVue } from '../../utils/vue/vue';

@WithRender
@Component
export class MI18n extends ModulVue {
    @Prop()
    public i18nKey: string;
    @Prop()
    public k: string;

    public created(): void {
        if (!this.$i18n) {
            throw new Error('MI18n -> this.$i18n is undefined, you must register the i18n plugin.');
        }
    }

    private get text(): string {
        let result = '';
        if (this.k) {
            result = this.$i18n.translate(this.k);
        } else if (this.i18nKey) {
            console.warn('MI18n -> attribute i18n-key is deprecated; use attribute "k" instead.');
            result = this.$i18n.translate(this.i18nKey);
        }

        return result;
    }
}

const I18nPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(I18N_NAME, MI18n);
    }
};

export default I18nPlugin;
