import Vue from 'vue';
import { MCurrencyType } from '../../utils/money/money';
import { formatCurrency, formatCurrencyWithOptions } from './money';


describe(`formatCurrency`, () => {
    it(`should return empty if the the amount is NaN`, () => {
        expect(formatCurrency(NaN, MCurrencyType.CAD)).toBe('');
    });

    it(`should return empty if the the amount is undefined`, () => {
        expect(formatCurrency(undefined!, MCurrencyType.CAD)).toBe('');
    });

    it(`should return empty if the the amount is empty`, () => {
        expect(formatCurrency('' as any, MCurrencyType.CAD)).toBe('');
    });

    it(`should work correctly for valid data for french locale`, () => {
        let moneyAmout: number = 1;
        (Vue.prototype).$i18n.getCurrentLocale = jest.fn(() => 'fr-CA');

        const formatedCurrency: string = formatCurrency(moneyAmout, MCurrencyType.USD);

        expect(formatedCurrency).toBeDefined();
        expect((Vue.prototype).$i18n.getCurrentLocale)
            .toHaveBeenCalled();
    });
});

describe(`formatCurrencyWithOptions`, () => {
    it(`should return empty if the the amount is NaN`, () => {
        expect(formatCurrencyWithOptions(NaN, { currency: MCurrencyType.CAD })).toBe('');
    });

    it(`should return empty if the the amount is undefined`, () => {
        expect(formatCurrencyWithOptions(undefined!, { currency: MCurrencyType.CAD })).toBe('');
    });

    it(`should return empty if the the amount is empty`, () => {
        expect(formatCurrencyWithOptions('' as any, { currency: MCurrencyType.CAD })).toBe('');
    });

    it(`should work correctly for valid data for french locale`, () => {
        let moneyAmout: number = 1;
        (Vue.prototype).$i18n.getCurrentLocale = jest.fn(() => 'fr-CA');

        const formatedCurrency: string = formatCurrencyWithOptions(moneyAmout, { currency: MCurrencyType.USD });

        expect(formatedCurrency).toBeDefined();
        expect((Vue.prototype).$i18n.getCurrentLocale)
            .toHaveBeenCalled();
    });
});

