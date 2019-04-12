import { createLocalVue } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import ModulPlugin from '../../utils/modul/modul';
import uuid from '../../utils/uuid/uuid';
import DatepickerPlugin from './datepicker';



jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MDatepicker', () => {
    let localVue: VueConstructor<Vue>;
    let mockDropDown: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(DatepickerPlugin);
        Vue.use(ModulPlugin);
    });

    it('dummy test', () => {
        expect(true).toBe(true);
    })
});
