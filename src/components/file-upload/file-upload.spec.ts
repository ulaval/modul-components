import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { createMockFile, createMockFileList } from '../../../tests/helpers/file';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import I18nPlugin from '../../components/i18n/i18n';
import FilePlugin, { DEFAULT_STORE_NAME, MFile, MFileStatus } from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import IconButtonPlugin from '../icon-button/icon-button';
import MessagePlugin from '../message/message';
import FileUploadPlugin, { MFileUpload } from './file-upload';

describe('MFileUpload', () => {
    beforeEach(() => {
        resetModulPlugins();
        Vue.use(FilePlugin);
        Vue.use(I18nPlugin);

        addMessages(Vue, ['components/file-upload/file-upload.lang.en.json']);
    });

    it('should render correctly', () => {
        const fupd = mount(MFileUpload);

        return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
    });

    it('should support optional $file store name', async () => {
        const fupd = mount(MFileUpload, {
            propsData: {
                storeName: 'unique-name'
            }
        });

        fupd.vm.$file.add(
            createMockFileList([createMockFile('file')]),
            'unique-name'
        );
        await Vue.nextTick();

        expect(fupd.emitted('files-ready')[0][0]).toHaveLength(1);
    });

    describe('validation', () => {
        const validationOpts = {
            extensions: ['jpg', 'png', 'mp4'],
            maxSizeKb: 1,
            maxFiles: 5
        };

        it('should pass validation options to $file service', () => {
            const filesvc = (Vue.prototype as ModulVue).$file;
            jest.spyOn(filesvc, 'setValidationOptions');

            const fupd = mount(MFileUpload, {
                propsData: validationOpts
            });

            expect(filesvc.setValidationOptions).toHaveBeenCalledWith(
                validationOpts,
                DEFAULT_STORE_NAME
            );
        });

        it('should render accepted file extensions', () => {
            const fupd = mount(MFileUpload, {
                propsData: validationOpts
            });

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        describe('validation messages', () => {
            let fupd: Wrapper<MFileUpload>;

            const stubMDialogRefs = (fu: MFileUpload) => {
                (fu.$refs.dialog as any) = {
                    $refs: {
                        body: document.createElement('div')
                    }
                };
            };

            beforeEach(() => {
                Vue.use(MessagePlugin);
                addMessages(Vue, ['components/message/message.lang.en.json']);

                fupd = mount(MFileUpload, {
                    propsData: validationOpts
                });

                stubMDialogRefs(fupd.vm);
            });

            it('should render rejected files in m-message', async () => {
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

                fupd.find('.m-message .m-icon-button').trigger('click');

                expect(fupd.vm.$file.files().length).toEqual(0);
            });
        });
    });

    describe('files selection / drop', () => {
        beforeEach(() => {
            const filesvc = (Vue.prototype as ModulVue).$file;
            filesvc.add(createMockFileList([createMockFile('uploading')]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should emit files-ready event when $file managed files change', async () => {
            const fupd = mount(MFileUpload);

            fupd.vm.$file.add(createMockFileList([createMockFile('new-file')]));
            await Vue.nextTick();

            expect(fupd.emitted('files-ready')[0][0]).toEqual([
                fupd.vm.$file.files()[1]
            ]);
        });
    });

    describe('main actions', () => {
        let fupd: Wrapper<MFileUpload>;
        let completedFile: MFile;

        beforeEach(() => {
            Vue.use(ButtonPlugin);

            const filesvc = (Vue.prototype as ModulVue).$file;
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

            fupd = mount(MFileUpload);
            fupd.vm.$refs.dialog = { closeDialog: jest.fn() } as any;
        });

        it('should emit done event when add button is clicked', () => {
            fupd
                .find('.m-file-upload__footer button:nth-child(1)')
                .trigger('click');

            expect(fupd.emitted('done')[0][0]).toEqual([completedFile]);
        });

        it('should clear all files when add button is clicked', () => {
            fupd
                .find('.m-file-upload__footer button:nth-child(1)')
                .trigger('click');

            expect(fupd.vm.$file.files().length).toEqual(0);
        });

        it('should emit cancel event when cancel button is clicked', () => {
            fupd
                .find('.m-file-upload__footer button:nth-child(2)')
                .trigger('click');

            expect(fupd.emitted('cancel')).toBeTruthy();
        });

        it('should clear all files when cancel button is clicked', () => {
            fupd
                .find('.m-file-upload__footer button:nth-child(2)')
                .trigger('click');

            expect(fupd.vm.$file.files().length).toEqual(0);
        });

        it('should emit file-upload-cancel event for each file being uploaded when cancel button is clicked', async () => {
            fupd.vm.$file.add(
                createMockFileList([createMockFile('uploading')])
            );
            const uploadingFile = fupd.vm.$file.files()[2];
            uploadingFile.status = MFileStatus.UPLOADING;

            fupd
                .find('.m-file-upload__footer .m-file-upload__footer__cancel')
                .trigger('click');

            const evt = fupd.emitted('file-upload-cancel');
            expect(evt[0][0]).toEqual(uploadingFile);
        });
    });

    describe('uploading', () => {
        let uploadingFileMock: File;

        beforeEach(() => {
            const filesvc = (Vue.prototype as ModulVue).$file;
            uploadingFileMock = createMockFile('uploading-file');
            filesvc.add(createMockFileList([uploadingFileMock]));
            filesvc.files()[0].status = MFileStatus.UPLOADING;
        });

        it('should render uploading files', () => {
            const fupd = mount(MFileUpload, {
                stubs: {
                    'transition-group': WrapChildrenStub('ul')
                }
            });

            fupd.vm.$file.files()[0].progress = 33;

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-upload-cancel when an uploading file cancel button is clicked', () => {
            Vue.use(IconButtonPlugin);
            const fupd = mount(MFileUpload);

            fupd.find('.m-file-upload__import-list__button').trigger('click');

            expect(fupd.emitted('file-upload-cancel')[0][0]).toBe(
                fupd.vm.$file.files()[0]
            );
        });
    });

    describe('completed', () => {
        let completedFileMock: File;

        beforeEach(() => {
            const filesvc = (Vue.prototype as ModulVue).$file;
            completedFileMock = createMockFile('completed-file');
            filesvc.add(createMockFileList([completedFileMock]));
            Object.assign(filesvc.files()[0], {
                status: MFileStatus.COMPLETED,
                progress: 100,
                completeHinted: true
            });
        });

        it('should render completed files', () => {
            const fupd = mount(MFileUpload, {
                stubs: {
                    'transition-group': WrapChildrenStub('ul')
                }
            });

            return expect(renderComponent(fupd.vm)).resolves.toMatchSnapshot();
        });

        it('should emit file-remove when a completed file is deleted', () => {
            Vue.use(IconButtonPlugin);
            const fupd = mount(MFileUpload);
            const deletingFile = fupd.vm.$file.files()[0];

            fupd.find('.m-file-upload__completed-list__button').trigger('click');

            expect(fupd.emitted('file-remove')[0][0]).toBe(deletingFile);
        });
    });
});
