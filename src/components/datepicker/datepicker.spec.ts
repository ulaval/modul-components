import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import moment from 'moment';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MIconButton } from '../icon-button/icon-button';
import DatepickerPlugin, { MDatepicker } from './datepicker';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MDatepicker', () => {
    let localVue: VueConstructor<Vue>;
    let mockDropDown: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        Vue.use(DatepickerPlugin);
        addMessages(Vue, [
            'components/datepicker/datepicker.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const tp = mount(MDatepicker, {
            localVue: localVue
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting is set', () => {
        const tp = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled is set', () => {
        const tp = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when error is set', () => {
        const tp = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                error: true,
                errorMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when valid is set', () => {
        const tp = mount(MDatepicker, {
            localVue: localVue,
            propsData: {
                valid: true,
                validMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(tp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly min/max time', () => {
        const tp = mount(MDatepicker, {
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
