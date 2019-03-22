import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import MoneyfieldPlugin, { MMoneyfield } from './moneyfield';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MTextfield', () => {
    beforeEach(() => {
        Vue.use(MoneyfieldPlugin);
    });

    it('should render correctly', () => {
        const component: Wrapper<MMoneyfield> = mount(MMoneyfield, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
