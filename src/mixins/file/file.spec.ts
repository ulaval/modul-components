import { FileMixin } from './file';

let fileMixin: FileMixin;

const VALID_FILENAME: string = 'text.html';
const VALID_FILENAME_RETURNED_VALUE: string = 'html';
const NOT_A_VALID_FILENAME: string = 'text';

describe(`FileMixin`, () => {

    beforeEach(() => {
        fileMixin = new FileMixin();
    });

    describe(`Given a valid filename`, () => {

        it(`Should return the right extension`, () => {
            let extension: string = fileMixin.extractFileExtension(VALID_FILENAME);

            expect(extension).toEqual(VALID_FILENAME_RETURNED_VALUE);
        });

    )};

    describe(`Given a non valid filename`, () => {

        it(`Should return the right extension`, () => {
            let extension: string = fileMixin.extractFileExtension(NOT_A_VALID_FILENAME);

            expect(extension).toEqual('');
        });

    )};

});
