import { createLocalVue, Wrapper, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import FileDropPlugin from './file-drop';
import FilePlugin from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';

describe('file-drop', () => {
    let localVue: VueConstructor<ModulVue>;
    let filedrop: Wrapper<ModulVue>;

    beforeEach(() => {
        localVue = createLocalVue();
        Vue.use(FilePlugin);
        localVue.use(FileDropPlugin);

        filedrop = mount(
            {
                template: '<div v-m-file-drop></div>'
            },
            { localVue }
        );
    });

    it('it should add files to $file on drop event', () => {
        const dropEvent = {
            dataTransfer: {
                files: [
                    createMockFile('mock file'),
                    createMockFile('mock file 2')
                ]
            }
        };
        filedrop.vm.$file.add = jasmine.createSpy();

        filedrop.find('div').trigger('drop', dropEvent);

        expect(filedrop.vm.$file.add).toHaveBeenCalledWith(
            dropEvent.dataTransfer.files
        );
    });

    it('it should clear files when unbound', () => {
        filedrop.vm.$file.clear = jasmine.createSpy();

        filedrop.destroy();

        expect(filedrop.vm.$file.clear).toHaveBeenCalledWith();
    });

    const createMockFile = (name: string): File => {
        // Note: for phantomjs support, see https://github.com/ariya/phantomjs/issues/14247
        const file: any = new Blob([]);
        file['name'] = name;
        return file as File;
    };
});
