import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { NBSP } from '../../utils/str/str';
import { TIME_NAME } from '../filter-names';
import DateFilterPlugin from './time';

describe(TIME_NAME, () => {
    beforeEach(() => {
        Vue.use(DateFilterPlugin);
    });

    it(`should return formatted time with minutes`, () => {
        const element: Wrapper<Vue> = mount(
            {
                template: `<span>{{ new Date(2018, 8, 27, 17, 05) | f-m-time }}</span>`
            },
                { localVue: Vue }
            );

        expect(element.vm.$el.textContent).toEqual(`17${NBSP}h${NBSP}05`);
    });

    it(`should return formatted time whitout minutes`, () => {
        const element: Wrapper<Vue> = mount(
            {
                template: `<span>{{ new Date(2018, 8, 27, 7, 0) | f-m-time }}</span>`
            },
                { localVue: Vue }
            );

        expect(element.vm.$el.textContent).toEqual(`7${NBSP}h`);
    });
});
