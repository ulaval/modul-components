import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { NBSP } from '../../../utils/str/str';
import { DATE_TIME_NAME } from '../../filter-names';
import { dateTimeFilter } from './date-time';

describe(DATE_TIME_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, [
            'filters/date/date/date.lang.en.json',
            'filters/date/time/time.lang.en.json',
            'filters/date/date-time/date-time.lang.en.json'
        ]);
    });

    it(`should return long formatted date time`, () => {
        const date: Date = new Date(2018, 8, 27, 17, 5);
        date.toLocaleDateString = jest.fn(() => '27 septembre 2018');

        expect(dateTimeFilter(date)).toEqual(`27 septembre 2018 à${NBSP}17${NBSP}h${NBSP}05`);
    });

    it(`should return long formatted date time with sup tags`, () => {
        const date: Date = new Date(2018, 9, 1, 7, 0);
        date.toLocaleDateString = jest.fn(() => '1 octobre 2018');
        jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

        expect(dateTimeFilter(date)).toEqual(`1<sup>er</sup> octobre 2018 à${NBSP}7${NBSP}h`);
    });

    it(`should return short formatted date time`, () => {
        const date: Date = new Date(2018, 8, 27, 17, 5);
        date.toLocaleDateString = jest.fn(() => '27 sept. 2018');

        expect(dateTimeFilter(date, true)).toEqual(`27 sept. 2018 17${NBSP}h${NBSP}05`);
    });

    it(`should return short formatted date time with sup tags`, () => {
        const date: Date = new Date(2018, 9, 1, 7, 0);
        date.toLocaleDateString = jest.fn(() => '1 oct. 2018');
        jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

        expect(dateTimeFilter(date, true)).toEqual(`1<sup>er</sup> oct. 2018 7${NBSP}h`);
    });
});
