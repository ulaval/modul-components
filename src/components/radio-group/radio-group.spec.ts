import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MRadioPosition, MRadioVerticalAlignement } from '../radio/radio';
import RadioGroupPlugin, { MRadioGroup } from './radio-group';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MRadioGroup', () => {
    let localVue: VueConstructor<Vue>;

    const slots: any = {
        default: `
                <m-radio value="rdo1"></m-radio>
                <m-radio value="rdo2"></m-radio>`
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(RadioGroupPlugin);
    });


    it('should emit change event when child radio is selected', () => {
        const grp: Wrapper<MRadioGroup> = mount(MRadioGroup, {
            localVue: localVue,
            slots: slots
        });

        grp.find('input').trigger('change');

        expect(grp.emitted('change')[0][0]).toEqual('rdo1');
    });

});
