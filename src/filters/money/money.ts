import Vue, { PluginObject } from 'vue';
import { MCurrencyType } from '../../utils/money/money';
import { ModulVue } from '../../utils/vue/vue';
import { MONEY_NAME } from '../filter-names';

export interface FormatCurrencyOptions {
    currency: MCurrencyType;
    stripDecimalZeroes?: boolean;
}

export function formatCurrency(money: number, currency: MCurrencyType): string {
    if (!isNaN(money)) {
        return new Number(money).toLocaleString((Vue.prototype as ModulVue).$i18n.getCurrentLocale(), {
            style: 'currency',
            currency: currency
        });
    } else {
        return '';
    }
}

export function formatCurrencyWithOptions(money: number, options: FormatCurrencyOptions): string {
    if (!isNaN(money)) {
        const stripDecimalZeroes: boolean = Number.isInteger(money) && !!options.stripDecimalZeroes;
        return new Number(money).toLocaleString((Vue.prototype as ModulVue).$i18n.getCurrentLocale(), {
            style: 'currency',
            currency: options.currency,
            minimumFractionDigits: stripDecimalZeroes ? 0 : undefined,
            maximumFractionDigits: stripDecimalZeroes ? 0 : undefined
        });
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
