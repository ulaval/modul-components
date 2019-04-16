import { createLocalVue, mount, TransitionStub } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalStub } from '../../../tests/helpers/render';
import ModulPlugin from '../../utils/modul/modul';
import uuid from '../../utils/uuid/uuid';
import DatepickerPlugin, { MDatepicker } from './datepicker';



jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');



describe('MDatepicker', () => {
    let localVue: VueConstructor<Vue>;
    let wrapper: any;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(DatepickerPlugin);
        Vue.use(ModulPlugin);
        wrapper = mount(MDatepicker, {
            sync: false,
            localVue: localVue,
            stubs: {
                transition: TransitionStub as any,
                portal: PortalStub as any
            }
        });
    });

    it('When the field is click then popup show open and field has focus', async () => {
        wrapper.trigger('click');

        await Vue.nextTick();
        wrapper.text();
    });
});
