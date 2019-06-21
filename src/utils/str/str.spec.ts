import { getString } from './str';

describe(`getString`, () => {
    describe(`Given undefined string`, () => {
        it(`Should return empty string`, () => {
            let result: string = getString(undefined);

            expect(result).toEqual('');
        });

    });
    describe(`Given empty string`, () => {
        it(`Should return empty string`, () => {
            let result: string = getString('');

            expect(result).toEqual('');
        });

    });

    describe(`Given a string`, () => {
        it(`Should return the string`, () => {
            let theString: string = 'a string to be returned';

            let result: string = getString(theString);

            expect(result).toEqual(theString);
        });

    });

    describe(`Given a function return a string`, () => {
        it(`Should return the string`, () => {
            let theStringFunction: () => string = () => 'a string to be returned';

            let result: string = getString(theStringFunction);

            expect(result).toEqual(theStringFunction());
        });

    });
});
