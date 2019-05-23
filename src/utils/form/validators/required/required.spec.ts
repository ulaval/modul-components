import { FormControl } from '../../form-control';
import { RequiredValidator } from './required';

describe('Required validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [RequiredValidator('test')]
    );

    test('it should return false if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return false if value is empty array', async (done) => {
        formControl.value = [];
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return false is value is empty string', async (done) => {
        formControl.value = '';
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true if value is 0', async (done) => {
        formControl.value = 0;
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    test('it should return true if value is set', async (done) => {
        formControl.value = 'test';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });
});
