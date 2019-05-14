import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import SearchfieldPlugin, { MSearchfield } from './searchfield';

const REF_INPUT_MASK: RefSelector = { ref: 'inputMask' };

let wrapper: Wrapper<MSearchfield>;

const initializeWrapper: () => Wrapper<MSearchfield> = () => {
    wrapper = shallowMount(MSearchfield);
    return wrapper;
};

beforeEach(() => {
    Vue.use(SearchfieldPlugin);
    wrapper = undefined!;
});

describe('MDecimalfield', () => {
    xit(`should update value correctly when user type in something in the input mask`, async () => {
        const newInputMaskValue: string = '123456.78';
        initializeWrapper();

        wrapper.find(REF_INPUT_MASK).vm.$emit('input', newInputMaskValue);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('input')[0]).toBeDefined();
        expect(wrapper.emitted('input')[0][0]).toBe(123456.78);
    });

    xit(`should update value correctly when user type in 0 the input mask`, async () => {
        const newInputMaskValue: string = '0';
        initializeWrapper();

        wrapper.find(REF_INPUT_MASK).vm.$emit('input', newInputMaskValue);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('input')[0]).toBeDefined();
        expect(wrapper.emitted('input')[0][0]).toBe(0);
    });
});

