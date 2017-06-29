import '../../utils/polyfills';
import Vue from 'vue';
import { MDynamicTemplate } from './dynamic-template';

describe('dynamic-template', () => {
    it('renders the template', () => {
        const vm: MDynamicTemplate = new MDynamicTemplate({ propsData: { template: '<span>abcde</span>' } }).$mount();

        Vue.nextTick(() => {
            expect(vm.$el.innerHTML).toBe('<span>abcde</span>');
        });
    });

    it('renders the new value on key change', () => {
        const vm: MDynamicTemplate = new MDynamicTemplate({ propsData: { template: '<span>abcde</span>' } }).$mount();
        vm.template = '<p>abcde</p>';

        Vue.nextTick(() => {
            expect(vm.$el.innerHTML).toBe('<p>abcde</p>');
        });
    });
});
