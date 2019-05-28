import { FormControl } from '../../form-control';
import { MaxLengthValidator } from './max-length';

describe('Max length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [MaxLengthValidator('test', 3)]
    );

    test('it should return true if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return true if value is empty string', () => {
        formControl.value = '';
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return false if is longer', () => {
        formControl.value = '1234';
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return true is same', () => {
        formControl.value = '123';
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return true if number length is shorter', () => {
        formControl.value = 12;
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return false if array length is longer', () => {
        formControl.value = [1, 2, 3, 4];
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return true if array length is shorter', () => {
        formControl.value = [1, 2];
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });
});
