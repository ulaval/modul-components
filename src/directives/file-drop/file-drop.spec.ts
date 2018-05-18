import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { createMockFile } from '../../../tests/helpers/file';
import FilePlugin, { DEFAULT_STORE_NAME } from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';
import FileDropPlugin from './file-drop';

describe('file-drop', () => {
    let localVue: VueConstructor<ModulVue>;
    let filedrop: Wrapper<ModulVue>;

    const dropEvent: any = {
        dataTransfer: {
            files: [createMockFile('mock file'), createMockFile('mock file 2')]
        }
    };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(FileDropPlugin);

        filedrop = mount(
            {
                template: '<div v-m-file-drop></div>'
            },
            { localVue: Vue }
        );
    });

    it('it should add files to $file on drop event', () => {
        filedrop.vm.$file.add = jest.fn();

        filedrop.find('div').trigger('drop', dropEvent);

        expect(filedrop.vm.$file.add).toHaveBeenCalledWith(
            dropEvent.dataTransfer.files,
            DEFAULT_STORE_NAME
        );
    });

    it('it should destroy files when unbound', () => {
        filedrop.vm.$file.destroy = jest.fn();

        filedrop.destroy();

        expect(filedrop.vm.$file.destroy).toHaveBeenCalledWith(
            DEFAULT_STORE_NAME
        );
    });

    it('it should not destroy files when unbound if keep-store modifier is set', () => {
        const fp: Wrapper<ModulVue> = mount(
            {
                template: '<div v-m-file-drop.keep-store></div>'
            },
            { localVue: Vue }
        );
        fp.vm.$file.destroy = jest.fn();

        fp.destroy();

        expect(fp.vm.$file.destroy).not.toHaveBeenCalled();
    });

    it('it should support optional $file store name argument', () => {
        filedrop = mount(
            {
                template: '<div v-m-file-drop="uniqueName"></div>',
                data: () => {
                    return {
                        uniqueName: 'uniqueValue'
                    };
                }
            },
            { localVue }
        );
        filedrop.vm.$file.add = jest.fn();
        filedrop.vm.$file.destroy = jest.fn();

        filedrop.find('div').trigger('drop', dropEvent);
        expect(filedrop.vm.$file.add).toHaveBeenCalledWith(
            dropEvent.dataTransfer.files,
            'uniqueValue'
        );

        filedrop.destroy();
        expect(filedrop.vm.$file.destroy).toHaveBeenCalledWith('uniqueValue');
    });
});
