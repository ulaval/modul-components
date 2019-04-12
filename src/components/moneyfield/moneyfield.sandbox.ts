import Vue, { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { ENGLISH, FRENCH, Messages } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MONEYFIELD_NAME } from '../component-names';
import MoneyFieldPlugin from './moneyfield';
import WithRender from './moneyfield.sandbox.html';


@WithRender
@Component
export class MMoneyfieldSandbox extends Vue {
    languages: string[] = [FRENCH, ENGLISH];
    selectedLanguage: string = (Vue.prototype as ModulVue).$i18n.currentLang();
    originalLang = (Vue.prototype as ModulVue).$i18n.currentLang();
    i18n: Messages = Vue.prototype.$i18n;
    model: number = 0;
    definedModel: number = 1;

    get isNumber(): boolean {
        return (typeof this.model === 'number');
    }

    @Watch('selectedLanguage')
    changeLanguage(): void {
        this.i18n.currentLang(this.selectedLanguage);
    }

    destroyed(): void {
        this.i18n.currentLang(this.originalLang);
    }
}

const MMoneyfieldSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MoneyFieldPlugin);
        v.component(`${MONEYFIELD_NAME}-sandbox`, MMoneyfieldSandbox);
    }
};

export default MMoneyfieldSandboxPlugin;
