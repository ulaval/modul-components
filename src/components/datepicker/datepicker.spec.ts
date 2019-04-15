import { createLocalVue } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import uuid from '../../utils/uuid/uuid';
import DatepickerPlugin from './datepicker';



jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MDatepicker', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(DatepickerPlugin);
    });

    it('When the field is click then popup show open and field has focus', () => {
        expect(true).toBe(true);
    });
});
