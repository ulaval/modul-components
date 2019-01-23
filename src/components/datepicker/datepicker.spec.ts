import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import moment from 'moment';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import DatepickerPlugin, { MDatepicker } from './datepicker';
import ModulPlugin from '../../utils/modul/modul';


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

    it('should render correctly', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting is set', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled is set', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when error is set', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                error: true,
                errorMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when valid is set', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                valid: true,
                validMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly min/max time', () => {
        const tp: Wrapper<MDatepicker> = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                duration: true,
                min: moment().subtract(2, 'years'),
                max: moment().add(2, 'years')
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });
});
