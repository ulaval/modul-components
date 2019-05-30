import { FormControl } from '../../form-control';
import { MinLengthValidator } from './min-length';

describe('Min length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [MinLengthValidator('test', 3)]
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

    test('it should return true if is longer', () => {
        formControl.value = '1234';
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return true is same', () => {
        formControl.value = '123';
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return true if number length is longer', () => {
        formControl.value = 1234;
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return false if array length is smaller', () => {
        formControl.value = [];
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return true if array length is longer', () => {
        formControl.value = [1, 2, 3, 4];
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });
});
