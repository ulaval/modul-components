import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { DATE_NAME } from '../../filter-names';
import { dateFilter } from './date';


describe(DATE_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/date/date.lang.en.json']);
    });

    it(`should return long formatted date`, () => {
        // French is not available in jsdom
        expect(dateFilter(new Date(2018, 8, 27))).toEqual('September 27, 2018');
    });

    it(`should return short formatted date`, () => {
        // French is not available in jsdom
        expect(dateFilter(new Date(2018, 8, 27), { shortMode: true })).toEqual('Sep 27, 2018');
    });

    describe(`When the date is the first of the month`, () => {
        let date: Date;
        beforeEach(() => {
            date = new Date(2018, 9, 1);
        });

        it(`should return long formatted date with sup tags`, () => {
            jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');
            date.toLocaleDateString = jest.fn(() => '1 octobre 2018');

            expect(dateFilter(date)).toEqual('1<sup>er</sup> octobre 2018');
        });

        it(`should return short formatted date with sup tags`, () => {
            jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');
            date.toLocaleDateString = jest.fn(() => '1 oct. 2018');

            expect(dateFilter(date, { shortMode: true })).toEqual('1<sup>er</sup> oct. 2018');
        });
    });
});
