import Vue, { PluginObject } from 'vue';
import MessagePlugin from '../../../components/message/message';
import { MMoney } from '../../../utils/money/money';
import { ModulVue } from '../../../utils/vue/vue';
import { MONEY_NAME } from '../../filter-names';

export class MoneyFilter {
    static formatCurrency(money: MMoney): string {
        if (!MoneyFilter.moneyCanDisplay(money)) {
            return '';
        }

        return money.amount.toLocaleString((Vue.prototype as ModulVue).$i18n.getCurrentLocale(), {
            style: 'currency',
            currency: money.currency
        });
    }

    static moneyCanDisplay(money: MMoney): boolean {
        return money && (!!money.amount || money.amount === 0) && !!money.currency;
    }
}

const MoneyPlugin: PluginObject<any> = {
    install(v): void {
        v.filter(MONEY_NAME, MoneyFilter.formatCurrency);
        v.use(MessagePlugin);
    }
};

export default MoneyPlugin;
