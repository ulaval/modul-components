import Vue from 'vue';

import { addMessages } from '../../../../tests/helpers/lang';
import { NBSP } from '../../../utils/str/str';
import { TIME_NAME } from '../../filter-names';
import { timeFilter } from './time';

describe(TIME_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/time/time.lang.en.json']);
    });

    it(`should return formatted time with minutes`, () => {
        expect(timeFilter(new Date(2018, 8, 27, 17, 5))).toEqual(`17${NBSP}h${NBSP}05`);
    });

    it(`should return formatted time whitout minutes`, () => {
        expect(timeFilter(new Date(2018, 8, 27, 7, 0))).toEqual(`7${NBSP}h`);
    });
});
