import { createLocalVue, mount, TransitionStub } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalStub } from '../../../tests/helpers/render';
import ModulPlugin from '../../utils/modul/modul';
import uuid from '../../utils/uuid/uuid';
import { MCalendar } from '../calendar/calendar';
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

    it('When the field is clicked then popup show open and field has focus', async () => {
        wrapper.trigger('click');


        expect(wrapper.emitted().click).toBeTruthy();
        expect(wrapper.emitted().focus).toBeTruthy();
        await Vue.nextTick();

        const calendar: any = wrapper.find('.m-calendar');
        expect(calendar.is(MCalendar)).toBe(true);

    });
});
