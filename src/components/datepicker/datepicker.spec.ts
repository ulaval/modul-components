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
    let wrapper: Wrapper<MDatepicker>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(DatepickerPlugin);
        Vue.use(ModulPlugin);
        wrapper = mount(MDatepicker, {
            localVue: localVue,
            stubs: {
                transition: TransitionStub as any,
                portal: PortalStub as any
            }
        });
    });

    it('When the field is clicked then popup show open and field has focus', async () => {
        wrapper.trigger('click');
        await Vue.nextTick();

        expect(wrapper.emitted().click).toBeTruthy();
        expect(wrapper.emitted().focus).toBeTruthy();

        const calendar: any = wrapper.find('.m-calendar');
        expect(calendar.is(MCalendar)).toBe(true);
    });

    it('When a invalid date is typed the model is cleared and error is shown', async () => {

        wrapper.setProps({ value: '2019-06-05' });

        let input: Wrapper<any> = wrapper.find('input');
        await Vue.nextTick();
        expect((input.element as HTMLInputElement).value).toBe('2019-06-05');

        expect(wrapper.emitted().change).toBeFalsy();

        (input.element as HTMLInputElement).value = '9999-99-99';
        input.trigger('input');
        await Vue.nextTick();

        expect(wrapper.emitted().change).toBeTruthy();
        expect(wrapper.emitted().change[0]).toEqual(['']);

        let validationMessage: Wrapper<any> = wrapper.find('.m-datepicker__validation__message');

        expect(validationMessage.props().error).toBe(true);
        expect(validationMessage.props().errorMessage).toBe('m-datepicker:format-error');

    });

    it('When a empty date is typed the model is cleared and error is cleared', async () => {
        wrapper.trigger('click');
        wrapper.setProps({ value: '2019-06-05' });

        let input: Wrapper<any> = wrapper.find('input');

        await Vue.nextTick();
        expect((input.element as HTMLInputElement).value).toBe('2019-06-05');

        expect(wrapper.emitted().change).toBeFalsy();

        (input.element as HTMLInputElement).value = '';
        input.trigger('input');
        await Vue.nextTick();

        expect(wrapper.emitted().change).toBeTruthy();
        expect(wrapper.emitted().change[0]).toEqual(['']);

        let validationMessage: Wrapper<any> = wrapper.find('.m-datepicker__validation__message');

        expect(validationMessage.props().error).toBe(false);
        expect(validationMessage.props().errorMessage).toBe('');
    });

    it('When a valid date is typed the model is emmited and error is cleared', async () => {
        let input: Wrapper<any> = wrapper.find('input');
        expect((input.element as HTMLInputElement).value).toBe('');

        expect(wrapper.emitted().change).toBeFalsy();

        (input.element as HTMLInputElement).value = '2019-06-06';
        input.trigger('input');
        await Vue.nextTick();

        expect(wrapper.emitted().change).toBeTruthy();
        expect(wrapper.emitted().change[0]).toEqual(['2019-06-06']);

        let validationMessage: Wrapper<any> = wrapper.find('.m-datepicker__validation__message');

        expect(validationMessage.props().error).toBe(false);
        expect(validationMessage.props().errorMessage).toBe('');
    });


});
