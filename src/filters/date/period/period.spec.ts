import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { PERIOD_NAME } from '../../filter-names';
import { MPeriod, periodFilter } from './period';

describe(PERIOD_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/period/period.lang.en.json', 'filters/date/date/date.lang.en.json']);
    });

    it(`should return formatted period`, () => {
        const period: MPeriod = {
            start: new Date(2019, 3, 8),
            end: new Date(2019, 4, 14)
        };
        expect(periodFilter(period)).toEqual('Du 8 avril 2019 au 14 mai 2019');
    });

    describe(`when the end date is missing`, () => {
        it(`then we only show the start date`, () => {
            const period: MPeriod = {
                start: new Date(2019, 3, 8)
            };

            expect(periodFilter(period)).toEqual('Débute le 8 avril 2019');
        });
    });

    describe(`when the start date is missing`, () => {
        it(`then we only show the end date`, () => {
            const period: MPeriod = {
                end: new Date(2019, 3, 8)
            };

            expect(periodFilter(period)).toEqual('Se termine le 8 avril 2019');
        });
    });

    describe(`when both dates are missing`, () => {
        it(`then it throws an error`, () => {
            const period: MPeriod = {};

            expect(() => periodFilter(period)).toThrow(Error);
        });
    });
});
