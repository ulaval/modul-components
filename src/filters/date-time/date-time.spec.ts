import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { NBSP } from '../../utils/str/str';
import { DATE_TIME_NAME } from '../filter-names';
import { dateTimeFilter } from './date-time';

describe(DATE_TIME_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, [
            'filters/date/date.lang.en.json',
            'filters/time/time.lang.en.json',
            'filters/date-time/date-time.lang.en.json'
        ]);
    });

    it(`should return long formatted date time`, () => {
        expect(dateTimeFilter(new Date(2018, 8, 27, 17, 5))).toEqual(`27 septembre 2018 à${NBSP}17${NBSP}h${NBSP}05`);
    });

    it(`should return long formatted date time with sup tags`, () => {
        expect(dateTimeFilter(new Date(2018, 9, 1, 7, 0))).toEqual(`1<sup>er</sup> octobre 2018 à${NBSP}7${NBSP}h`);
    });

    it(`should return short formatted date time`, () => {
        expect(dateTimeFilter(new Date(2018, 8, 27, 17, 5), true)).toEqual(`27 sept. 2018 17${NBSP}h${NBSP}05`);
    });

    it(`should return short formatted date time with sup tags`, () => {
        expect(dateTimeFilter(new Date(2018, 9, 1, 7, 0), true)).toEqual(`1<sup>er</sup> oct. 2018 7${NBSP}h`);
    });
});
