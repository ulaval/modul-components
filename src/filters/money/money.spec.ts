import Vue from 'vue';
import { MONEY_NAME } from '../filter-names';
import { formatCurrency, MCurrencyType } from './money';


describe(MONEY_NAME, () => {

    it(`should return empty if the currency can't be displayed`, () => {
        expect(formatCurrency(NaN)).toBe('');
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



