import { FormControl } from '../../form-control';
import { MaxLengthValidator } from './max-length';

describe('Max length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [MaxLengthValidator('test', 3)]
    );

    test('it should return true if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return true if value is empty string', async (done) => {
        formControl.value = '';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return false if is longer', async (done) => {
        formControl.value = '1234';
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true is same', async (done) => {
        formControl.value = '123';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return true if number length is shorter', async (done) => {
        formControl.value = 12;
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return false if array length is longer', async (done) => {
        formControl.value = [1, 2, 3, 4];
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true if array length is shorter', async (done) => {
        formControl.value = [1, 2];
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });
});
