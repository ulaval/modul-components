import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import uuid from '../../utils/uuid/uuid';
import { InputManagement } from './input-management';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('InputManagement', () => {

    let localVue: VueConstructor<Vue>;
    let wrapper: Wrapper<InputManagement>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        wrapper = mount(InputManagement, {
            localVue: localVue,
            propsData: {
                value: 'initValue'
            }
        });
    });


    it('When component is monting with value it should not emit', async () => {

        expect(wrapper.emitted('input')).toBeFalsy();
        expect(wrapper.vm.model).toBe('initValue');
    });

    it('When component is updated with value it should not emit', async () => {

        wrapper.setProps({ value: 'updatedValue' });
        expect(wrapper.emitted('input')).toBeFalsy();
        expect(wrapper.vm.model).toBe('updatedValue');
    });

    it('When model is set with updated value it should emit', async () => {

        wrapper.vm.model = 'updatedValue2';

        expect(wrapper.emitted('input').length).toBe(1);
        expect(wrapper.emitted('input')[0][0]).toBe('updatedValue2');
        expect(wrapper.vm.model).toBe('updatedValue2');
    });

});
