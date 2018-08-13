import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import I18nPlugin from '../../components/i18n/i18n';
import FileSizeFilterPlugin from './filesize';

describe(`f-m-filesize`, () => {
    beforeEach(() => {
        Vue.use(I18nPlugin);
        Vue.use(FileSizeFilterPlugin);
        addMessages(Vue, ['filters/filesize/filesize.lang.en.json']);
    });

    it(`the result should be a string with the file size formatted`, () => {
        const element: Wrapper<Vue> = mount(
            {
                template: `<span>{{ 1024 | f-m-filesize }}</span>`
            },
                { localVue: Vue }
            );

        expect(element.vm.$el.textContent).toEqual('1 Kb');
    });
});
