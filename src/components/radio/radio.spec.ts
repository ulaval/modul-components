import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import RadioPlugin, { MRadio, MRadioPosition } from './radio';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MRadio', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(RadioPlugin);
    });

    it('should render correctly', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                value: 'radio'
            },
            slots: {
                default: 'label'
            }
        });

        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when radio is selected', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                modelValue: 'radio',
                value: 'radio'
            }
        });

        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly name when set', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                name: 'name',
                value: 'radio'
            }
        });

        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                disabled: true,
                value: 'radio'
            }
        });

        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
    });

    it('should not render icon when not part of a group', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                iconName: 'chip-error',
                value: 'radio'
            }
        });

        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when position is right', () => {
        const rdo: Wrapper<MRadio> = mount(MRadio, {
            localVue: localVue,
            propsData: {
                position: MRadioPosition.Right,
                value: 'radio'
            }
        });
        return expect(renderComponent(rdo.vm)).resolves.toMatchSnapshot();
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
