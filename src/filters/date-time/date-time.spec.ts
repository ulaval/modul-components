import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { NBSP } from '../../utils/str/str';
import { DATE_TIME_NAME } from '../filter-names';
import { dateTimeFilter } from './date-time';

describe(DATE_TIME_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, [
            'filters/date/date.lang.fr.json',
            'filters/time/time.lang.fr.json',
            'filters/date-time/date-time.lang.fr.json'
        ]);
    });

    it(`should return long formatted date time`, () => {
        expect(dateTimeFilter(new Date(2018, 8, 27, 17, 5))).toEqual(`27 septembre 2018 à${NBSP}17${NBSP}h${NBSP}05`);
    });

    it(`should return short formatted date time`, () => {
        expect(dateTimeFilter(new Date(2018, 9, 1, 7, 0), true)).toEqual(`1er oct. 2018 7${NBSP}h`);
    });
});
