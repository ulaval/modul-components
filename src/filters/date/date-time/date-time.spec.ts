import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
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
        date.toLocaleDateString = jest.fn(() => '27 septembre');

        expect(dateTimeFilter(date)).toBe(`27 septembre à ${new Intl.DateTimeFormat('', {
            hour: 'numeric',
            minute: 'numeric'
        }).format(date)}`);
    });

    it(`should return long formatted date time with sup tags`, () => {
        const date: Date = new Date(2018, 9, 1, 7, 0);
        date.toLocaleDateString = jest.fn(() => '1 octobre');
        jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

        expect(dateTimeFilter(date)).toBe(`1<sup>er</sup> octobre à ${new Intl.DateTimeFormat('', {
            hour: 'numeric'
        }).format(date)}`);
    });

    it(`should return short formatted date time`, () => {
        const date: Date = new Date(2018, 8, 27, 17, 5);
        date.toLocaleDateString = jest.fn(() => '27 sept.');

        expect(dateTimeFilter(date, true)).toBe(`27 sept. ${new Intl.DateTimeFormat('', {
            hour: 'numeric',
            minute: 'numeric'
        }).format(date)}`);
    });

    it(`should return short formatted date time with sup tags`, () => {
        const date: Date = new Date(2018, 9, 1, 7, 0);
        date.toLocaleDateString = jest.fn(() => '1 oct.');
        jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

        expect(dateTimeFilter(date, true)).toBe(`1<sup>er</sup> oct. ${new Intl.DateTimeFormat('', {
            hour: 'numeric'
        }).format(date)}`);
    });
});
