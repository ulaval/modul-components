import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { createMockFile, createMockFileList } from '../../../tests/helpers/file';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import I18nPlugin from '../../components/i18n/i18n';
import FileSizeFilterPlugin from '../../filters/filesize/filesize';
import FilePlugin, { DEFAULT_STORE_NAME, FileService, MFile, MFileStatus, MFileValidationOptions } from '../../utils/file/file';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import UserAgentUtil from '../../utils/user-agent/user-agent';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { MESSAGE_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import { MMessage } from '../message/message';
import ModulPlugin from './../../utils/modul/modul';
import { MFileUpload } from './file-upload';

const BTN_REPLACE_FILE: string = 'Replace';
const TITLE_REPLACE_FILE: string = 'Replace file';
const BTN_ADD_NEW_FILE: string = 'Add';
const TITLE_ADD_NEW_FILE: string = 'Upload files';

jest.mock('../../utils/user-agent/user-agent', () => ({
    UserAgentUtil: () => jest.fn(),
    isDesktop: jest.fn()
}));

let mockIsDesktopValue: boolean = true;
(UserAgentUtil.isDesktop as jest.Mock).mockImplementation(() => mockIsDesktopValue);



describe('MFileUpload', () => {
    beforeEach(() => {
        resetModulPlugins();
        Vue.use(ModulPlugin);
        Vue.use(FileSizeFilterPlugin);
        Vue.use(FilePlugin);
        Vue.use(I18nPlugin);
        Vue.use(MediaQueriesPlugin);

        addMessages(Vue, ['components/file-upload/file-upload.lang.en.json']);
        addMessages(Vue, ['filters/filesize/filesize.lang.en.json']);
    });

    it('should render correctly', () => {
        const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
            mocks: { $mq: { state: { isMqMinS: true } } }
        });

        return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly in mobile', () => {
        const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
            mocks: { $mq: { state: { isMqMinS: true } } }
        });

        return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
    });

    it('should support optional $file store name', async () => {
        const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
            propsData: {
                storeName: 'unique-name'
            }
        });

        fupd.vm.$file.add(
            createMockFileList([createMockFile('file.jpg')]),
            'unique-name'
        );
        await Vue.nextTick();

        expect(fupd.emitted('files-ready')[0][0]).toHaveLength(1);
    });

    describe('validation', () => {
        let validationOpts: MFileValidationOptions;

        beforeEach(() => {
            validationOpts = {
                allowedExtensions: ['jpg', 'png', 'mp4'],
                rejectedExtensions: ['mov'],
                maxSizeKb: 1,
                maxFiles: 5
            };
        });

        it('should pass validation options to $file service when extensions property is modified', async () => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');
            const fupd: Wrapper<MFileUpload> = mount(MFileUpload, {
                propsData: { ...validationOpts },
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            const newAcceptedExtensions: string[] = ['avi', 'mp3'];
            const newRejectedExtensions: string[] = ['css', 'js'];
            const newValidationOpts: MFileValidationOptions = { ...validationOpts };
            newValidationOpts.allowedExtensions = newAcceptedExtensions;
            newValidationOpts.rejectedExtensions = newRejectedExtensions;

            fupd.setProps({
                allowedExtensions: newAcceptedExtensions,
                rejectedExtensions: newRejectedExtensions
            });

            await Vue.nextTick(() => {
                expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                    newValidationOpts,
                    DEFAULT_STORE_NAME
                );
            });
            // await Vue.nextTick();
        });

        it('should pass validation options to $file service when maxSizeKb property is modified', async () => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                propsData: validationOpts,
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            const newMaxSizeKb: number = 100;
            const newValidationOpts: MFileValidationOptions = { ...validationOpts };
            newValidationOpts.maxSizeKb = newMaxSizeKb;
            fupd.setProps({ maxSizeKb: newValidationOpts.maxSizeKb });

            await Vue.nextTick();
            expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                newValidationOpts,
                DEFAULT_STORE_NAME
            );
        });

        it('should pass validation options to $file service when maxFiles property is modified', async () => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                propsData: validationOpts,
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            const newMaxFiles: number = 25;
            fupd.setProps({ maxFiles: newMaxFiles });

            const newValidationOpts: MFileValidationOptions = { ...validationOpts };
            newValidationOpts.maxFiles = newMaxFiles;

            await Vue.nextTick();
            expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                newValidationOpts,
                DEFAULT_STORE_NAME
            );
        });

        it('should pass validation options to $file service', () => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                propsData: validationOpts,
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                validationOpts,
                DEFAULT_STORE_NAME
            );
        });

        it('should render accepted file extensions', () => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                propsData: validationOpts,
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        describe('validation messages', () => {
            let fupd: Wrapper<MFileUpload>;

            const stubMModalRefs: (fu: MFileUpload) => void = (fu: MFileUpload) => {
                (fu.$refs.modal as any) = {
                    $refs: {
                        body: document.createElement('div')
                    }
                };
            };

            beforeEach(() => {
                Vue.use(IconButtonPlugin);
                Vue.component(MESSAGE_NAME, MMessage);
                addMessages(Vue, ['components/message/message.lang.en.json']);

                fupd = shallowMount(MFileUpload, {
                    propsData: validationOpts,
                    mocks: { $mq: { state: { isMqMinS: true } } }
                });

                stubMModalRefs(fupd.vm);
            });

            it('should render rejected files in dialog', async () => {
                fupd.vm.$file.add(
                    createMockFileList([
                        createMockFile('invalid-extensions'),
                        createMockFile('invalid-size.jpg', 2000),
                        createMockFile('valid1.jpg'),
                        createMockFile('valid2.jpg'),
                        createMockFile('valid3.jpg'),
                        createMockFile('valid4.jpg'),
                        createMockFile('valid5.jpg'),
                        createMockFile('max-files.jpg')
                    ])
                );

                await Vue.nextTick();
                expect(await renderComponent(fupd.vm)).toMatchSnapshot();
            });

            it('should clear rejected files when validation message is closed', async () => {
                fupd.vm.$file.add(
                    createMockFileList([createMockFile('invalid-extensions')])
                );
                await Vue.nextTick();

                fupd.find({ ref: 'message' }).vm.$emit('close');

                expect(fupd.vm.$file.files().length).toEqual(0);
            });
        });

        describe('when fileReplacement is false', () => {

            let fupd: Wrapper<MFileUpload>;

            beforeEach(() => {
                fupd = shallowMount(MFileUpload, {
                    propsData: validationOpts
                });
            });

            it('should be the right title', () => {
                expect(fupd.vm.title).toEqual(TITLE_ADD_NEW_FILE);
            });

            it('should be the right button', () => {
                expect(fupd.vm.buttonAdd).toEqual(BTN_ADD_NEW_FILE);
            });
        });

        describe('when fileReplacement is true', () => {

            let filesvc: FileService;
            let fupd: Wrapper<MFileUpload>;

            beforeEach(() => {
                filesvc = (Vue.prototype as ModulVue).$file;
                jest.spyOn(filesvc, 'setValidationOptions');

                fupd = shallowMount(MFileUpload, {
                    propsData: {
                        allowedExtensions: validationOpts.allowedExtensions,
                        rejectedExtensions: validationOpts.rejectedExtensions,
                        maxSizeKb: validationOpts.maxSizeKb,
                        maxFiles: validationOpts.maxFiles,
                        fileReplacement: true
                    }
                });

                fupd.setData({ isMqMinS: true });
            });

            it('should allowed only 1 file', async () => {

                const newValidationOpts: MFileValidationOptions = { ...validationOpts };
                newValidationOpts.maxFiles = 1;

                await Vue.nextTick();
                expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                    newValidationOpts,
                    DEFAULT_STORE_NAME
                );
            });

            it('should be the right title', () => {
                expect(fupd.vm.title).toEqual(TITLE_REPLACE_FILE);
            });

            it('should be the right button', () => {
                expect(fupd.vm.buttonAdd).toEqual(BTN_REPLACE_FILE);
            });

        });
    });

    describe('files selection / drop', () => {
        beforeEach(() => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            filesvc.add(createMockFileList([createMockFile('uploading')]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should emit files-ready event when $file managed files change', async () => {
            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload);

            fupd.vm.$file.add(createMockFileList([createMockFile('new-file.jpg')]));
            await Vue.nextTick();

            expect(fupd.emitted('files-ready')[0][0]).toEqual([
                fupd.vm.$file.files()[1]
            ]);
        });

        describe('the drop zone', () => {
            it('should be available on desktop with small screen size or larger', () => {

                const fupd: Wrapper<MFileUpload> = mount(MFileUpload, {
                    mocks: { $mq: { state: { isMqMinS: true } } }
                });

                expect(fupd.vm.isDropZoneEnabled).toBeTruthy();
            });
            it('should not be available on desktop with small screen size or lower', () => {
                const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                    mocks: { $mq: { state: { isMqMinS: false } } }
                });

                expect(fupd.vm.isDropZoneEnabled).toBeFalsy();
            });
            it('should not be available on mobile', () => {
                mockIsDesktopValue = false;
                const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                    mocks: { $mq: { state: { isMqMinS: true } } }
                });

                expect(fupd.vm.isDropZoneEnabled).toBeFalsy();

            });
            it('should not be available on mobile with small screen size or larger', () => {
                mockIsDesktopValue = false;
                const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                    mocks: { $mq: { state: { isMqMinS: true } } }
                });

                expect(fupd.vm.isDropZoneEnabled).toBeFalsy();

            });
        });
    });

    describe('main actions', () => {
        let fupd: Wrapper<MFileUpload>;
        let completedFile: MFile;

        beforeEach(() => {
            Vue.use(ButtonPlugin);

            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
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

            fupd = shallowMount(MFileUpload);
            fupd.vm.$refs.modal = { closeModal: jest.fn() } as any;
        });

        it('should emit done event when add button is clicked', () => {
            fupd.find({ ref: 'modalConfirmButton' }).vm.$emit('click');

            expect(fupd.emitted('done')[0][0]).toEqual([completedFile]);
        });

        it('should clear all files when add button is clicked', () => {
            fupd.find({ ref: 'modalConfirmButton' }).vm.$emit('click');

            expect(fupd.vm.$refs.modal.closeModal).toHaveBeenCalled();
        });

        it('should emit cancel event when cancel button is clicked', () => {
            fupd.find({ ref: 'modalCancelButton' }).vm.$emit('click');

            expect(fupd.emitted('cancel')).toBeTruthy();
        });

        it('should clear all files when cancel button is clicked', () => {
            jest.spyOn(fupd.vm.$refs.modal, 'closeModal');
            fupd.find({ ref: 'modalCancelButton' }).vm.$emit('click');

            expect(fupd.vm.$refs.modal.closeModal).toHaveBeenCalled();
        });

        it('should emit file-upload-cancel event for each file being uploaded when cancel button is clicked', async () => {
            fupd.vm.$file.add(
                createMockFileList([createMockFile('uploading')])
            );

            jest.spyOn(fupd.vm.$refs.modal, 'closeModal');
            const uploadingFile: MFile = fupd.vm.$file.files()[2];
            uploadingFile.status = MFileStatus.UPLOADING;

            fupd.find({ ref: 'modalCancelButton' }).vm.$emit('click');

            expect(fupd.vm.$refs.modal.closeModal).toHaveBeenCalled();
        });
    });

    describe('uploading', () => {
        let uploadingFileMock: File;

        beforeEach(() => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            uploadingFileMock = createMockFile('uploading-file');
            filesvc.add(createMockFileList([uploadingFileMock]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should render uploading files', () => {
            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                stubs: {
                    'transition-group': WrapChildrenStub('ul')
                },
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            fupd.vm.$file.files()[0].progress = 33;

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-upload-cancel when an uploading file cancel button is clicked', () => {
            Vue.use(IconButtonPlugin);
            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload);

            fupd.find({ ref: 'cancelUploadButton' }).vm.$emit('click');

            expect(fupd.emitted('file-upload-cancel')[0][0]).toBe(
                fupd.vm.$file.files()[0]
            );
        });
    });

    describe('completed', () => {
        let completedFileMock: File;

        beforeEach(() => {
            const filesvc: FileService = (Vue.prototype as ModulVue).$file;
            completedFileMock = createMockFile('completed-file');
            filesvc.add(createMockFileList([completedFileMock]));
            Object.assign(filesvc.files()[0], {
                status: MFileStatus.COMPLETED,
                progress: 100,
                completeHinted: true
            });
        });

        it('should render completed files', () => {
            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload, {
                stubs: {
                    'transition-group': WrapChildrenStub('ul')
                },
                mocks: { $mq: { state: { isMqMinS: true } } }
            });

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-remove when a completed file is deleted', () => {
            Vue.use(IconButtonPlugin);
            const fupd: Wrapper<MFileUpload> = shallowMount(MFileUpload);
            const deletingFile: MFile = fupd.vm.$file.files()[0];

            fupd.find({ ref: 'removeButton' }).vm.$emit('click');

            expect(fupd.emitted('file-remove')[0][0]).toBe(deletingFile);
        });
    });
});
