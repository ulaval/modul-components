import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../../tests/helpers/render';
import uuid from '../../../utils/uuid/uuid';
import MChipDeletePlugin, { MChipDelete } from './chip-delete';

jest.mock('../../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('Chip', () => {
    beforeEach(() => {
        Vue.use(MChipDeletePlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MChipDelete> = mount(MChipDelete, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
