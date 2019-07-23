import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import LimitElementsPlugin, { MLimitElements } from './limit-elements';

describe('MLimitElements', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(LimitElementsPlugin);
    });

    it('should emit list-opened when list is open', async () => {
        const wrapper: Wrapper<MLimitElements> = mount(MLimitElements, {
            localVue: localVue,
            propsData: {
                elements: ['Element 1', 'Element 2', 'Element 3', 'Element 4']
            }
        });

        wrapper.find({ ref: 'link' }).vm.$emit('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('list-opened')).toBeTruthy();
    });

    it('should emit list-closed when list is open', async () => {
        const wrapper: Wrapper<MLimitElements> = mount(MLimitElements, {
            localVue: localVue,
            propsData: {
                elements: ['Element 1', 'Element 2', 'Element 3', 'Element 4'],
                open: true
            }
        });

        wrapper.find({ ref: 'link' }).vm.$emit('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('list-closed')).toBeTruthy();
    });
});

