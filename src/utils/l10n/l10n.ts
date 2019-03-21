import { PluginObject } from 'vue';
import { MCurrencyType } from '../money/money';

export enum MCurrencySymbolPosition {
    Before = 'before',
    After = 'after'
}

export interface L10nPluginOptions {
    curCurrency?: MCurrencyType;
}

export class MCurrency {
    constructor(public type: MCurrencyType, public localizedSymbol: string, public symbolPosition: MCurrencySymbolPosition) { }
}

export class L10n {
    private currency: MCurrencyType;

    constructor(options?: L10nPluginOptions) {
        this.currency = (options || {}).curCurrency || MCurrencyType.CAD;
    }

    get currentCurrency(): MCurrencyType {
        return this.currency;
    }

    set currentCurrency(value: MCurrencyType) {
        this.currency = value;
    }

    getCurrencyDetail(locale: string): MCurrency {
        const currency: MCurrencyType = this.currentCurrency;
        const currencyTemplate: string = new Intl.NumberFormat(locale, { maximumSignificantDigits: 1, style: 'currency', currency: MCurrencyType[currency] }).format(0);
        const localizedSymbol: string = currencyTemplate.replace('0', '').trim();

        return new MCurrency(
            currency,
            localizedSymbol,
            currencyTemplate.split(localizedSymbol)[0] === '' ? MCurrencySymbolPosition.Before : MCurrencySymbolPosition.After
        );
    }
}

const L10nPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('$l10n', 'plugin.install');
        (v.prototype).$l10n = new L10n(options);
    }
};

export default L10nPlugin;
