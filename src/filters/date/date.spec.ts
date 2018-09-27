import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import I18nPlugin from '../../components/i18n/i18n';
import { DATE_NAME } from '../filter-names';
import DateFilterPlugin from './date';

describe(DATE_NAME, () => {
    beforeEach(() => {
        Vue.use(I18nPlugin);
        Vue.use(DateFilterPlugin);
        addMessages(Vue, ['filters/date/date.lang.en.json']);
    });

    it(`should return long formatted date`, () => {
        const element: Wrapper<Vue> = mount(
            {
                template: `<span>{{ new Date(2018, 8, 27) | f-m-date }}</span>`
            },
                { localVue: Vue }
            );

        expect(element.vm.$el.textContent).toEqual('September 27th, 2018');
    });

    it(`should return short formatted date`, () => {
        const element: Wrapper<Vue> = mount(
            {
                template: `<span>{{ new Date(2018, 8, 27) | f-m-date(true) }}</span>`
            },
                { localVue: Vue }
            );

        expect(element.vm.$el.textContent).toEqual('Sep 27th, 2018');
    });
});
