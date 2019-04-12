import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import RadioPlugin, { MRadio, MRadioPosition, MRadioVerticalAlignement } from './radio';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');
describe('MRadio', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(RadioPlugin);
    });

    it('should emit change event when model is modified', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                value: 'radio'
            }
        });

        rdo.setData({ model: 'radio' });

        expect(rdo.emitted('change')[0][0]).toEqual('radio');
    });

});
