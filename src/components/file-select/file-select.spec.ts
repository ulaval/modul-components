import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MButton } from '../button/button';
import FileSelectPlugin, { MFileSelect } from './file-select';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('file-select', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(FileSelectPlugin);
        addMessages(localVue, [
            'components/file-select/file-select.lang.en.json',
            'components/validation-message/validation-message.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const fileSelect = mount(MFileSelect, {
            localVue: localVue
        });

        return expect(
            renderComponent(fileSelect.vm)
        ).resolves.toMatchSnapshot();
    });

    it('should flow down button props', () => {
        const buttonProps = {
            skin: 'primary',
            disabled: true,
            waiting: true,
            fullSize: true,
            iconName: 'icon-name',
            iconPosition: 'right',
            iconSize: '24px'
        };

        const fileSelect = mount(MFileSelect, {
            localVue: localVue,
            propsData: buttonProps
        });

        expect(fileSelect.find(MButton).props()).toEqual(buttonProps);
    });

    it('should set multiple attribute on input based on prop value', () => {
        const fileSelect = mount(MFileSelect, {
            localVue: localVue
        });

        fileSelect.setProps({ multiple: true });
        expect(fileSelect.find('input').attributes()).toHaveProperty(
            'multiple'
        );

        fileSelect.setProps({ multiple: false });
        expect(fileSelect.find('input').attributes()).not.toHaveProperty(
            'multiple'
        );
    });

    it('should emit click event when button is clicked', () => {
        const fileSelect = mount(MFileSelect, {
            localVue: localVue
        });

        fileSelect.find(MButton).trigger('click');

        expect(fileSelect.emitted('click')).toBeTruthy();
    });
});
