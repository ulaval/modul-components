import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import Vue from 'vue';
import { createMockFile, createMockFileList } from '../../../tests/helpers/file';
import { HttpService } from '../http/http';
import { RequestConfig } from '../http/rest';
import { ModulVue } from '../vue/vue';
import { extractExtension, FileService, MFile, MFileRejectionCause, MFileStatus } from './file';


jest.mock('../http/http');

const FILENAME_POSITION_1: string = 'file.jpg';
const FILENAME_POSITION_2: string = 'file.mov';
const FILENAME_POSITION_3: string = 'file';

describe('FileService', () => {
    let filesvc: FileService;

    beforeEach(() => {
        filesvc = new FileService();

        filesvc.add(
            createMockFileList([createMockFile('file-store-a')]),
            'store-a'
        );

        filesvc.add(
            createMockFileList([
                createMockFile('file-store-b-1'),
                createMockFile('file-store-b-1')
            ]),
            'store-b'
        );
    });

    describe('add', () => {
        it('should store files uniquely in store name', () => {
            expect(filesvc.files('store-a').length).toEqual(1);
            expect(filesvc.files('store-a')[0].name).toEqual('file-store-a');
            expect(filesvc.files('store-b').length).toEqual(2);
            expect(filesvc.files('store-b')[1].name).toEqual('file-store-b-1');
        });

        it('should generate unique ids for each file', () => {
            expect(filesvc.files('store-b')[0].uid).not.toEqual(
                filesvc.files('store-b')[1].uid
            );
        });

        it('should support an unnamed default store', () => {
            filesvc.add(
                createMockFileList([createMockFile('file-store-default')])
            );

            expect(filesvc.files().length).toEqual(1);
            expect(filesvc.files()[0].name).toEqual('file-store-default');
        });
    });

    describe('remove', () => {
        it('should remove the file identified by the unique id', () => {
            let mockFile: File = createMockFile('to be removed');
            filesvc.add(createMockFileList([mockFile]), 'unique store');

            filesvc.remove(
                filesvc.files('unique store')[0].uid,
                'unique store'
            );

            expect(filesvc.files('unique store').length).toEqual(0);
        });
    });

    describe('clear', () => {
        it('should remove all files', () => {
            filesvc.clear();
            filesvc.clear('store-a');

            expect(filesvc.files().length).toEqual(0);
            expect(filesvc.files('store-a').length).toEqual(0);
            expect(filesvc.files('store-b').length).not.toEqual(0);
        });
    });

    describe('validations', () => {

        describe(`No mather what`, () => {
            it(`should not accept a file without an extension`, () => {

                filesvc.add(
                    createMockFileList([
                        createMockFile(FILENAME_POSITION_3)
                    ])
                );

                expect(readyFiles().length).toEqual(0);
                expect(rejectedFiles().length).toEqual(1);
                expect(rejectedFiles()[0].name).toEqual(FILENAME_POSITION_3);
                expect(rejectedFiles()[0].status).toEqual(MFileStatus.REJECTED);
                expect(rejectedFiles()[0].rejection).toEqual(MFileRejectionCause.FILE_TYPE);
            });
        });

        describe(`When there is only accepted extensions`, () => {
            it(`should accept the right file`, () => {
                filesvc.setValidationOptions({
                    allowedExtensions: ['jpg', 'mov']
                });

                mockFiles();

                expect(readyFiles().length).toEqual(2);
                expect(rejectedFiles().length).toEqual(0);
                expect(readyFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(readyFiles()[1].name).toEqual(FILENAME_POSITION_2);
            });
        });

        describe(`When there is no accepted extensions`, () => {
            it(`should accept every files`, () => {
                filesvc.setValidationOptions({
                    allowedExtensions: []
                });

                mockFiles();

                expect(readyFiles().length).toEqual(2);
                expect(rejectedFiles().length).toEqual(0);
                expect(readyFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(readyFiles()[1].name).toEqual(FILENAME_POSITION_2);
            });
        });

        describe(`When there is only rejected extensions`, () => {
            it(`should reject the right files`, () => {
                filesvc.setValidationOptions({
                    rejectedExtensions: ['jpg', 'mov']
                });

                mockFiles();

                expect(readyFiles().length).toEqual(0);
                expect(rejectedFiles().length).toEqual(2);
                expect(rejectedFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(rejectedFiles()[1].name).toEqual(FILENAME_POSITION_2);
                expect(rejectedFiles()[0].status).toEqual(MFileStatus.REJECTED);
                expect(rejectedFiles()[0].rejection).toEqual(MFileRejectionCause.FILE_TYPE);
            });

            it(`should accept every other files`, () => {
                filesvc.setValidationOptions({
                    rejectedExtensions: ['mp4', 'mp3']
                });

                mockFiles();

                expect(readyFiles().length).toEqual(2);
                expect(rejectedFiles().length).toEqual(0);
                expect(readyFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(readyFiles()[1].name).toEqual(FILENAME_POSITION_2);

            });
        });

        describe(`When there is a mix of accepted and rejected extensions`, () => {
            it(`should only accept the file with the right extension`, () => {
                filesvc.setValidationOptions({
                    allowedExtensions: ['jpg'],
                    rejectedExtensions: ['mov']
                });

                mockFiles();

                expect(readyFiles().length).toEqual(1);
                expect(rejectedFiles().length).toEqual(1);
                expect(readyFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(rejectedFiles()[0].name).toEqual(FILENAME_POSITION_2);
                expect(rejectedFiles()[0].status).toEqual(MFileStatus.REJECTED);
                expect(rejectedFiles()[0].rejection).toEqual(MFileRejectionCause.FILE_TYPE);
            });
        });

        describe(`When there is accepted extensions in the rejected extensions`, () => {
            it(`should only accept the file with the right extension`, () => {
                filesvc.setValidationOptions({
                    allowedExtensions: ['jpg', 'mov'],
                    rejectedExtensions: ['mov']
                });

                mockFiles();

                expect(readyFiles().length).toEqual(1);
                expect(rejectedFiles().length).toEqual(1);
                expect(readyFiles()[0].name).toEqual(FILENAME_POSITION_1);
                expect(rejectedFiles()[0].name).toEqual(FILENAME_POSITION_2);
                expect(rejectedFiles()[0].status).toEqual(MFileStatus.REJECTED);
                expect(rejectedFiles()[0].rejection).toEqual(MFileRejectionCause.FILE_TYPE);
            });
        });

        it('should reject files too big', () => {
            filesvc.setValidationOptions({
                maxSizeKb: 2
            });

            filesvc.add(
                createMockFileList([
                    createMockFile('invalid.mov', 4096),
                    createMockFile('valid.jpg', 1024)
                ])
            );

            expectValidationResults(1, MFileRejectionCause.FILE_SIZE);
        });

        it('should reject files after exceeding maximum', () => {
            filesvc.setValidationOptions({
                maxFiles: 1
            });

            filesvc.add(
                createMockFileList([
                    createMockFile('valid.jpg'),
                    createMockFile('invalid.mov')
                ])
            );

            expectValidationResults(1, MFileRejectionCause.MAX_FILES);
        });

        const expectValidationResults: (
            expectedNbReadyFiles: number,
            rejectionCause: MFileRejectionCause) => void = (
                expectedNbReadyFiles: number,
                rejectionCause: MFileRejectionCause) => {

                expect(readyFiles().length).toEqual(expectedNbReadyFiles);
                expect(rejectedFiles().length).toEqual(1);
                expect(rejectedFiles()[0].name).toEqual('invalid.mov');
                expect(rejectedFiles()[0].status).toEqual(MFileStatus.REJECTED);
                expect(rejectedFiles()[0].rejection).toEqual(rejectionCause);
            };

        const readyFiles: () => MFile[] = () => {
            return filesvc.files().filter(f => f.status === MFileStatus.READY);
        };

        const rejectedFiles: () => MFile[] = () => {
            return filesvc.files().filter(f => f.status === MFileStatus.REJECTED);
        };

        const mockFiles: () => void = () => {
            filesvc.add(
                createMockFileList([
                    createMockFile(FILENAME_POSITION_1),
                    createMockFile(FILENAME_POSITION_2)
                ])
            );
        };
    });

    describe('get', () => {
        it('should return correct file extension', () => {
            filesvc.add(
                createMockFileList([
                    createMockFile('file.jpg'),
                    createMockFile('file.jpeg'),
                    createMockFile('file.mp4')
                ])
            );

            expect(filesvc.files()[0].extension).toEqual('jpg');
            expect(filesvc.files()[1].extension).toEqual('jpeg');
            expect(filesvc.files()[2].extension).toEqual('mp4');
        });

        it('should return empty string when there is no extension', () => {
            filesvc.add(createMockFileList([createMockFile('noextension')]));

            expect(filesvc.files()[0].extension).toEqual('');
        });
    });

    describe('upload spec', () => {
        let fileToUpload: MFile;
        let httpSvcMock: jest.Mocked<HttpService>;
        let originalHttpSvc: HttpService;

        const mockHttpService: () => jest.Mocked<HttpService> = () => {
            httpSvcMock = new HttpService() as jest.Mocked<HttpService>;
            (Vue.prototype as ModulVue).$http = httpSvcMock;
            httpSvcMock.execute.mockReturnValue(Promise.resolve() as any);

            return httpSvcMock;
        };

        beforeEach(() => {
            httpSvcMock = mockHttpService();

            filesvc.add(createMockFileList([createMockFile('file-upload')]));
            fileToUpload = filesvc.files()[0];
        });

        describe('upload', () => {
            it('should allow a custom request configuration', () => {
                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake',
                    config: {
                        method: 'PUT'
                    }
                });

                const cfg: RequestConfig = httpSvcMock.execute.mock.calls[0][0];
                expect(cfg.method).toEqual('PUT');
            });

            it('should set the file status as uploading when starting upload', () => {
                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                expect(fileToUpload.status).toEqual(MFileStatus.UPLOADING);
            });

            it('should set the file status as completed when done uploading', async () => {
                await filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                expect(fileToUpload.status).toEqual(MFileStatus.COMPLETED);
            });

            it('should set the file status as failed when an error is encountered', async () => {
                httpSvcMock.execute.mockReturnValue(
                    Promise.reject('network error') as any
                );

                try {
                    await filesvc.upload(fileToUpload.uid, {
                        url: 'http://fake'
                    });
                } catch { }

                expect(fileToUpload.status).toEqual(MFileStatus.FAILED);
            });

            it('should set the file progress when uploading', () => {
                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                let axiosOptions: AxiosRequestConfig | undefined;
                axiosOptions = httpSvcMock.execute.mock.calls[0][1];
                axiosOptions!.onUploadProgress!({
                    loaded: 10,
                    total: 200
                });

                expect(fileToUpload.progress).toEqual(5);
            });

            it('should allow an upload progress callback when needed', () => {
                let customUploadProgressCalled: boolean = false;

                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake',
                    onUploadProgress: () => (customUploadProgressCalled = true)
                });

                let axiosOptions: AxiosRequestConfig | undefined;
                axiosOptions = httpSvcMock.execute.mock.calls[0][1];
                axiosOptions!.onUploadProgress!({
                    loaded: 10,
                    total: 200
                });

                expect(customUploadProgressCalled).toBeTruthy();
            });
        });

        describe('upload cancellation', () => {
            let cancelerMock: jest.Mocked<CancelTokenSource>;

            const mockCanceler: () => jest.Mocked<CancelTokenSource> = (): jest.Mocked<CancelTokenSource> => {
                const cancelerMock: any = {
                    token: jest.fn(),
                    cancel: jest.fn()
                };

                jest
                    .spyOn(axios.CancelToken, 'source')
                    .mockReturnValue(cancelerMock);

                return cancelerMock;
            };

            beforeEach(() => {
                cancelerMock = mockCanceler();
            });

            it('should provide a cancellation token to the request', () => {
                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                let axiosOptions: AxiosRequestConfig | undefined;
                axiosOptions = httpSvcMock.execute.mock.calls[0][1];
                expect(axiosOptions!.cancelToken).not.toBeUndefined();
            });

            it('should cancel the request using token', () => {
                filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                filesvc.cancelUpload(fileToUpload.uid);

                expect(cancelerMock.cancel).toHaveBeenCalled();
            });

            it('should set the file status to canceled', async () => {
                httpSvcMock.execute.mockReturnValue(
                    Promise.reject({
                        __CANCEL__: true
                    }) as any
                );

                await filesvc.upload(fileToUpload.uid, {
                    url: 'http://fake'
                });

                expect(fileToUpload.status).toEqual(MFileStatus.CANCELED);
            });
        });
    });
});

const VALID_FILENAME: string = 'text.html';
const VALID_FILENAME_RETURNED_VALUE: string = 'html';
const NOT_A_VALID_FILENAME: string = 'text';

describe(`FileMixin`, () => {

    describe(`Given a valid filename`, () => {

        it(`Should return the right extension`, () => {
            let extension: string = extractExtension(VALID_FILENAME);

            expect(extension).toEqual(VALID_FILENAME_RETURNED_VALUE);
        });

    });
});

describe(`Given a non valid filename`, () => {

    it(`Should return the right extension`, () => {
        let extension: string = extractExtension(NOT_A_VALID_FILENAME);

        expect(extension).toEqual('');
    });
});
