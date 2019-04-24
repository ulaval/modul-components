import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import uuid from '../../utils/uuid/uuid';
import TextfieldPlugin, { MTextfield, MTextfieldType } from './textfield';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MTextfield', () => {
    beforeEach(() => {
        Vue.use(TextfieldPlugin);
    });

    [MTextfieldType.Email, MTextfieldType.Password, MTextfieldType.Telephone, MTextfieldType.Text, MTextfieldType.Url]
        .forEach((type: MTextfieldType) => {
            it('should return inputType equal to type prop', () => {
                const component: Wrapper<MTextfield> = mount(MTextfield, {
                    localVue: Vue,
                    propsData: { type }
                });

                expect(component.vm.inputType).toBe(type);
            });
        });

    it('should return inputType text for type password if passwordAsText is true', () => {
        const component: Wrapper<MTextfield> = mount(MTextfield, {
            localVue: Vue,
            propsData: { type: MTextfieldType.Password, passwordIcon: true, value: 'someValue' }
        });

        component.find('.m-textfield__icon-password').trigger('click');

        expect(component.vm.inputType).toBe(MTextfieldType.Text);
    });
});
