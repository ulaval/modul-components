import Vue, { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import DropdownPlugin from '../../components/dropdown/dropdown';
import IntegerfieldPlugin from '../../components/integerfield/integerfield';
import { Enums } from '../../utils/enums/enums';
import { ENGLISH, FRENCH, Messages } from '../../utils/i18n/i18n';
import { MCurrencyType } from '../../utils/money/money';
import { ModulVue } from '../../utils/vue/vue';
import MoneyPlugin from './money';
import WithRender from './money.sandbox.html';


@WithRender
@Component
export class MMoneySandbox extends Vue {
    selectedCurrency: MCurrencyType = MCurrencyType.CAD;
    selectedLanguage: string = (Vue.prototype as ModulVue).$i18n.currentLang();
    amount: number = NaN;
    currencies: { key: any, value: string }[] = Enums.toKeyValueArray(MCurrencyType);
    languages: string[] = [FRENCH, ENGLISH];
    originalLang = (Vue.prototype as ModulVue).$i18n.currentLang();

    get integerFieldAmount(): string {
        return (this.amount || '').toString();
    }

    set integerFieldAmount(value: string) {
        this.amount = value || value === '0' ? parseFloat(value) : NaN;
    }

    @Watch('selectedLanguage')
    changeLanguage(): void {
        Vue.prototype.$i18n = new Messages({ curLang: this.selectedLanguage });
        this.$forceUpdate();
    }

    destroyed(): void {
        (Vue.prototype as ModulVue).$i18n.currentLang(this.originalLang);
    }
}

const MMoneySandboxPlugin: PluginObject<any> = {
    install(v): void {
        v.component('m-money-sandbox', MMoneySandbox);
        v.use(MoneyPlugin);
        v.use(IntegerfieldPlugin);
        v.use(DropdownPlugin);
    }
};

export default MMoneySandboxPlugin;
