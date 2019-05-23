import { FormControl } from '../../form-control';
import { MinLengthValidator } from './min-length';

describe('Min length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [MinLengthValidator('test', 3)]
    );

    test('it should return false if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return false if value is empty string', async (done) => {
        formControl.value = '';
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true if is longer', async (done) => {
        formControl.value = '1234';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return true is same', async (done) => {
        formControl.value = '123';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return true if number length is longer', async (done) => {
        formControl.value = 1234;
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return false if array length is smaller', async (done) => {
        formControl.value = [];
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true if array length is longer', async (done) => {
        formControl.value = [1, 2, 3, 4];
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });
});
