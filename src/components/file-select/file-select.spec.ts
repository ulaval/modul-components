import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { createMockFile, createMockFileList } from '../../../tests/helpers/file';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import { DEFAULT_STORE_NAME } from '../../utils/file/file';
import uuid from '../../utils/uuid/uuid';
import { MButton, MButtonType } from '../button/button';
import FileSelectPlugin, { MFileSelect } from './file-select';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('file-select', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(FileSelectPlugin);
        addMessages(Vue, [
            'components/file-select/file-select.lang.en.json',
            'components/validation-message/validation-message.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            localVue: Vue
        });

        return expect(
            renderComponent(fileSelect.vm)
        ).resolves.toMatchSnapshot();
    });

    it('should flow down button props', () => {
        const buttonProps: any = {
            skin: 'primary',
            disabled: true,
            waiting: true,
            fullSize: true,
            iconName: 'icon-name',
            iconPosition: 'right',
            iconSize: '24px',
            precision: undefined,
            type: MButtonType.Button
        };

        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            localVue: Vue,
            propsData: buttonProps
        });

        expect(fileSelect.find(MButton).props()).toEqual(buttonProps);
    });

    it('should set multiple attribute on input based on prop value', () => {
        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            localVue: Vue
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
        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            localVue: Vue
        });

        fileSelect.find(MButton).trigger('click');

        expect(fileSelect.emitted('click')).toBeTruthy();
    });

    it('it should add selected files to $file', () => {
        const mockFiles: FileList = createMockFileList([createMockFile('file')]);

        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            localVue: Vue
        });
        fileSelect.vm.$file.add = jest.fn();
        (fileSelect.vm.$refs.inputFile as any) = {
            files: mockFiles
        };

        fileSelect.find('input').trigger('change');

        expect(fileSelect.vm.$file.add).toHaveBeenCalledWith(
            mockFiles,
            DEFAULT_STORE_NAME
        );
    });

    it('it should support optional store name prop', () => {
        const fileSelect: Wrapper<MFileSelect> = mount(MFileSelect, {
            propsData: {
                storeName: 'unique-store'
            },
            localVue: Vue
        });

        const addMock: jest.Mock<{}> = jest.fn();
        fileSelect.vm.$file.add = addMock;

        fileSelect.find('input').trigger('change');

        expect(addMock.mock.calls[0][1]).toEqual('unique-store');
    });
});
