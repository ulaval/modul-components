import Vue from 'vue';
import { MCurrencyType, MMoney, MMoneyFactory } from '../../../utils/money/money';
import { ModulVue } from '../../../utils/vue/vue';
import { MONEY_NAME } from '../../filter-names';
import { formatCurrency } from './money';


const fakeNumber: (numberToFake: number) => number = (numberToFake: number) => {
    return Object.assign({}, numberToFake);
};

describe(MONEY_NAME, () => {
    [
        undefined,
        MMoneyFactory.create(),
        MMoneyFactory.createAllParams(NaN, MCurrencyType.CAD),
        MMoneyFactory.createAllParams(undefined, MCurrencyType.CAD),
        MMoneyFactory.createAllParams(123, undefined),
        MMoneyFactory.createAllParams(123, MCurrencyType.NONE)
    ].forEach((money: MMoney) => {
        it(`should return empty if the currency can't be displayed (${JSON.stringify(money)})`, () => {
            expect(formatCurrency(money)).toBe('');
        });
    });

    [
        MMoneyFactory.createAllParams(fakeNumber(0), MCurrencyType.CAD),
        MMoneyFactory.createAllParams(fakeNumber(123), MCurrencyType.USD)
    ].forEach((money: MMoney) => {
        it(`should work correctly for valid data (${JSON.stringify(money)})`, () => {
            const expectedReturnValue: string = 'someString';
            money.amount.toLocaleString = jest.fn(() => expectedReturnValue);

            const formatedCurrency: string = formatCurrency(money);

            expect(formatedCurrency).toBe(expectedReturnValue);
            expect(money.amount.toLocaleString)
                .toHaveBeenCalledWith((Vue.prototype as ModulVue).$i18n.getCurrentLocale(), {
                    style: 'currency',
                    currency: money.currency
                });
        });
    });
});
