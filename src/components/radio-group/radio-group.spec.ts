import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MRadioPosition } from '../radio/radio';
import RadioGroupPlugin, { MRadioGroup } from './radio-group';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MRadioGroup', () => {
    let localVue: VueConstructor<Vue>;

    const slots = {
        default: `
                <m-radio value="rdo1"></m-radio>
                <m-radio value="rdo2"></m-radio>`
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(RadioGroupPlugin);
    });

    it('should render correctly', () => {
        const grp = mount(MRadioGroup, {
            localVue: localVue,
            slots: slots
        });

        return expect(renderComponent(grp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when position is right', () => {
        const grp = mount(MRadioGroup, {
            localVue: localVue,
            propsData: {
                position: MRadioPosition.Right
            },
            slots: slots
        });

        return expect(renderComponent(grp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when inline', () => {
        const grp = mount(MRadioGroup, {
            localVue: localVue,
            propsData: {
                inline: true
            },
            slots: slots
        });

        return expect(renderComponent(grp.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const grp = mount(MRadioGroup, {
            localVue: localVue,
            propsData: {
                disabled: true
            },
            slots: slots
        });

        return expect(renderComponent(grp.vm)).resolves.toMatchSnapshot();
    });

    it('should emit change event when child radio is selected', () => {
        const grp = mount(MRadioGroup, {
            localVue: localVue,
            slots: slots
        });

        grp.find('input').trigger('change');

        expect(grp.emitted('change')[0][0]).toEqual('rdo1');
    });
});
