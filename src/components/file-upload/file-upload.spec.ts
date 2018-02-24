import { createLocalVue, mount, Stubs } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { createMockFile, createMockFileList } from '../../../tests/helpers/file';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import FilePlugin, { MFile, MFileStatus } from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import FileUploadPlugin, { MFileUpload } from './file-upload';

describe('MFileUpload', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(FilePlugin);
        localVue.use(I18nPlugin);
        addMessages(localVue, [
            'components/file-upload/file-upload.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const fupd = mountFileUpd();

        return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
    });

    describe('validation', () => {
        const validationOpts = {
            extensions: ['jpg', 'png', 'mp4'],
            maxSizeKb: 100,
            maxFiles: 5
        };

        it('should pass validation options to $file service', () => {
            const filesvc = (localVue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd = mountFileUpd(validationOpts);

            expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                validationOpts
            );
        });

        it('should render accepted file extensions', () => {
            const fupd = mountFileUpd(validationOpts);

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should render rejected files in modal', async () => {
            const fupd = mount(MFileUpload, {
                localVue: localVue,
                propsData: validationOpts
            });

            fupd.vm.$file.add(
                createMockFileList([
                    createMockFile('invalid-file-a'),
                    createMockFile('invalid-file-b')
                ])
            );

            await Vue.nextTick();
            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('files selection / drop', () => {
        beforeEach(() => {
            const filesvc = (localVue.prototype as ModulVue).$file;
            filesvc.add(createMockFileList([createMockFile('uploading')]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should emit files-ready event when $file managed files change', async () => {
            const fupd = mountFileUpd();

            fupd.vm.$file.add(createMockFileList([createMockFile('new-file')]));
            await Vue.nextTick();

            expect(fupd.emitted('files-ready')[0][0]).toEqual([
                fupd.vm.$file.files()[1]
            ]);
        });
    });

    describe('main actions', () => {
        let completedFile: MFile;
        beforeEach(() => {
            const filesvc = (localVue.prototype as ModulVue).$file;
            filesvc.add(
                createMockFileList([
                    createMockFile('ready'),
                    createMockFile('completed')
                ])
            );
            completedFile = filesvc.files()[0];
            Object.assign(completedFile, {
                status: MFileStatus.COMPLETED,
                completeHinted: true
            });
        });

        it('should emit done event when add button is clicked', () => {
            localVue.use(ButtonPlugin);
            const fupd = mountFileUpd();

            fupd.find('button:nth-child(1)').trigger('click');

            expect(fupd.emitted('done')[0][0]).toEqual([completedFile]);
        });

        it('should emit cancel event when cancel button is clicked', () => {
            localVue.use(ButtonPlugin);
            const fupd = mountFileUpd();
            fupd.vm.$refs.dialog = { closeDialog: jest.fn() } as any;

            fupd.find('button:nth-child(2)').trigger('click');

            expect(fupd.emitted('cancel')).toBeTruthy();
        });
    });

    describe('uploading', () => {
        let uploadingFileMock: File;

        beforeEach(() => {
            const filesvc = (localVue.prototype as ModulVue).$file;
            uploadingFileMock = createMockFile('uploading-file');
            filesvc.add(createMockFileList([uploadingFileMock]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should render uploading files', () => {
            const fupd = mountFileUpd(undefined, {
                'transition-group': WrapChildrenStub('ul')
            });

            fupd.vm.$file.files()[0].progress = 33;

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-upload-cancel when an uploading file cancel button is clicked', () => {
            localVue.use(IconButtonPlugin);
            const fupd = mountFileUpd();

            fupd.find('button').trigger('click');

            expect(fupd.emitted('file-upload-cancel')[0][0]).toBe(
                fupd.vm.$file.files()[0]
            );
        });
    });

    describe('completed', () => {
        let completedFileMock: File;

        beforeEach(() => {
            const filesvc = (localVue.prototype as ModulVue).$file;
            completedFileMock = createMockFile('completed-file');
            filesvc.add(createMockFileList([completedFileMock]));
            Object.assign(filesvc.files()[0], {
                status: MFileStatus.COMPLETED,
                progress: 100,
                completeHinted: true
            });
        });

        it('should render completed files', () => {
            const fupd = mountFileUpd(undefined, {
                'transition-group': WrapChildrenStub('ul')
            });

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-remove when a completed file is deleted', () => {
            localVue.use(IconButtonPlugin);
            const fupd = mountFileUpd();
            const deletingFile = fupd.vm.$file.files()[0];

            fupd.find('button').trigger('click');

            expect(fupd.emitted('file-remove')[0][0]).toBe(deletingFile);
        });
    });

    const mountFileUpd = (propsData?: object, stubs?: Stubs) => {
        return mount(MFileUpload, {
            localVue: localVue,
            propsData: propsData,
            stubs: {
                'm-modal': '<m-modal-stub></m-modal-stub>',
                ...stubs
            }
        });
    };
});
