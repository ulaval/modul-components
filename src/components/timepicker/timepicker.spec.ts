import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import moment from 'moment';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MIconButton } from '../icon-button/icon-button';
import TimepickerPlugin, { MTimepicker } from './timepicker';
import ModulPlugin from '../../utils/modul/modul';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MTimepicker', () => {
    let localVue: VueConstructor<Vue>;
    let mockDropDown: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(TimepickerPlugin);
        Vue.use(ModulPlugin);
        addMessages(Vue, [
            'components/timepicker/timepicker.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                time: moment('02:00 PM', 'h:mm A')
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting is set', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                waiting: true,
                time: moment('02:00 PM', 'h:mm A')
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled is set', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                disabled: true,
                time: moment('02:00 PM', 'h:mm A')
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when error is set', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                error: true,
                time: moment('02:00 PM', 'h:mm A'),
                errorMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when valid is set', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                valid: true,
                time: moment('02:00 PM', 'h:mm A'),
                validMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly min/max time', () => {
        const tp: Wrapper<MTimepicker> = mount(MTimepicker, {
            localVue: localVue,
            propsData: {
                duration: true,
                time: moment('03:00', 'h:mm A'),
                min: moment.duration(2, 'hour'),
                max: moment.duration(7, 'hour')
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });
});
