import { createLocalVue, mount, TransitionStub, Wrapper } from '@vue/test-utils';
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
    let wrapper: Wrapper<Vue>;

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

    it('When a invalid date is entered then the field value is cleared and emmited', async () => {
        wrapper.setProps({ value: '2018-04-25' });
        await Vue.nextTick();
        const input: Wrapper<Vue> = wrapper.find('input');
        expect(input.is('input')).toBe(true);


        const inputElement: HTMLInputElement = input.element as HTMLInputElement;
        expect(inputElement.value).toBe('2018-04-25');

        // change input to a invalid value
        inputElement.value = '2018-99-99';
        input.trigger('input');
        await Vue.nextTick();

        expect((wrapper.vm as MDatepicker).calandarError).toBe(true);
        expect(wrapper.emitted('change').length).toBe(1);
        expect(wrapper.emitted('change')[0][0]).toBe('');

    });

});
