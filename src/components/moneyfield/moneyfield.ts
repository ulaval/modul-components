import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { MCurrency } from '../../utils/l10n/l10n';
import { ModulVue } from '../../utils/vue/vue';
import { MONEYFIELD_NAME } from '../component-names';
import IntegerfieldPlugin from '../integerfield/integerfield';
import WithRender from './moneyfield.html';

// TODO: Everything here is dispensable.  This will be all replaced by a wrapper of decimal-field.
@WithRender
@Component({
    inheritAttrs: false
})
export class MMoneyfield extends ModulVue {

    get currencyDetail(): MCurrency {
        return (this as ModulVue).$l10n.getCurrencyDetail(this.currentLocale);
    }

    get currentLocale(): string {
        return (this as ModulVue).$i18n.currentLocale;
    }

}

const MoneyFieldPlugin: PluginObject<any> = {
    install(v): void {

        v.use(IntegerfieldPlugin);
        v.component(MONEYFIELD_NAME, MMoneyfield);
    }
};

export default MoneyFieldPlugin;
