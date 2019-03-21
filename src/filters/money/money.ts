import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { MONEY_NAME } from '../filter-names';


// ISO 4217  https://www.currency-iso.org/en/home/tables/table-a1.html
export enum MCurrencyType {
    CAD = 'CAD',
    USD = 'USD',
    EUR = 'EUR'
}

export function formatCurrency(money: number, currency = MCurrencyType.CAD): string {

    if (!isNaN(money)) {

        let numberString: string = new Number(money).toLocaleString((Vue.prototype as ModulVue).$i18n.getCurrentLocale(), {
            style: 'currency',
            currency: currency
        });

        return numberString;
    } else {
        return '';
    }

}


const MoneyPlugin: PluginObject<any> = {
    install(v): void {
        v.filter(MONEY_NAME, formatCurrency);
    }
};

export default MoneyPlugin;
