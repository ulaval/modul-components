import { createLocalVue, RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import ModulPlugin from '../../utils/modul/modul';
import TimepickerPlugin, { MTimepicker } from './timepicker';

const REF_INPUT: RefSelector = { ref: 'input' };

describe('MTimepicker', () => {
    let localVue: VueConstructor<Vue>;
    const TESTTIME: string = '11:22';
    const TESTHOUR: number = 11;
    const TESTMINUTE: number = 22;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(TimepickerPlugin);
        Vue.use(ModulPlugin);
    });

    it('should update on input change', () => {
        const timepicker: Wrapper<MTimepicker> = shallowMount(MTimepicker, {
            localVue: localVue
        });

        timepicker.find(REF_INPUT).vm.$emit('input', TESTTIME);

        expect(timepicker.emitted().input).toBeDefined();
        expect(timepicker.vm.currentTime).toEqual(TESTTIME);
        expect(timepicker.vm.currentHour).toEqual(TESTHOUR);
        expect(timepicker.vm.currentMinute).toEqual(TESTMINUTE);
        expect(timepicker.emitted().input[0]).toEqual([TESTTIME]);

    });

    it('should update on model change', () => {
        const timepicker: Wrapper<MTimepicker> = shallowMount(MTimepicker, {
            localVue: localVue
        });

        timepicker.setProps({ value: TESTTIME });
        expect(timepicker.props().value).toBe(TESTTIME);

        expect(timepicker.emitted().input).toBeDefined();
        expect(timepicker.vm.currentTime).toEqual(TESTTIME);
        expect(timepicker.vm.currentHour).toEqual(TESTHOUR);
        expect(timepicker.vm.currentMinute).toEqual(TESTMINUTE);
        expect(timepicker.emitted().input[0]).toEqual([TESTTIME]);

    });
});
