import '../../utils/polyfills';
import Vue from 'vue';
import { MDynamicTemplate } from './dynamic-template';

describe('dynamic-template', () => {
    it('renders the template', () => {
        const Ctor = Vue.extend(MDynamicTemplate);
        const vm = new Ctor({ propsData: { template: '<span>abcde</span>' } }).$mount();

        Vue.nextTick(() => {
            expect(vm.$el.innerHTML).toBe('<span>abcde</span>');
        });
    });

    it('renders the new value on key change', () => {
        const Ctor = Vue.extend(MDynamicTemplate);
        const vm = new Ctor({ propsData: { template: '<span>abcde</span>' } }).$mount();
        (vm as MDynamicTemplate).template = '<p>abcde</p>';

        Vue.nextTick(() => {
            expect(vm.$el.innerHTML).toBe('<p>abcde</p>');
        });
    });
});
