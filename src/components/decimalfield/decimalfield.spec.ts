import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import DecimalfieldPlugin, { MDecimalfield } from './decimalfield';

const REF_INPUT_MASK: RefSelector = { ref: 'inputMask' };

let wrapper: Wrapper<MDecimalfield>;

const initializeWrapper: () => Wrapper<MDecimalfield> = () => {
    wrapper = shallowMount(MDecimalfield);
    return wrapper;
};

beforeEach(() => {
    Vue.use(DecimalfieldPlugin);
    wrapper = undefined!;
});

describe('MDecimalfield', () => {
    it(`should update value correctly when user type in something in the input mask`, async () => {
        const newInputMaskValue: string = '123456.78';
        initializeWrapper();

        wrapper.find(REF_INPUT_MASK).vm.$emit('input', newInputMaskValue);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('input')[0]).toBeDefined();
        expect(wrapper.emitted('input')[0][0]).toBe(123456.78);
    });

    it(`should update value correctly when user type in 0 the input mask`, async () => {
        const newInputMaskValue: string = '0';
        initializeWrapper();

        wrapper.find(REF_INPUT_MASK).vm.$emit('input', newInputMaskValue);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('input')[0]).toBeDefined();
        expect(wrapper.emitted('input')[0][0]).toBe(0);
    });
});

