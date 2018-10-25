import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { DATE_NAME } from '../filter-names';
import { dateFilter } from './date';

describe(DATE_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/date.lang.en.json']);
    });

    it(`should return long formatted date`, () => {
        expect(dateFilter(new Date(2018, 8, 27))).toEqual('27 septembre 2018');
    });

    it(`should return long formatted date with sup tags`, () => {
        expect(dateFilter(new Date(2018, 9, 1))).toEqual('1<sup>er</sup> octobre 2018');
    });

    it(`should return short formatted date`, () => {
        expect(dateFilter(new Date(2018, 8, 27), true)).toEqual('27 sept. 2018');
    });

    it(`should return short formatted date with sup tags`, () => {
        expect(dateFilter(new Date(2018, 9, 1), true)).toEqual('1<sup>er</sup> oct. 2018');
    });
});
