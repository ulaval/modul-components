import { FormControl } from '../../form-control';
import { RequiredValidator } from './required';

describe('Required validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        [RequiredValidator('test')]
    );

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return false if value is empty array', () => {
        formControl.value = [];
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return false is value is empty string', () => {
        formControl.value = '';
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return true if value is 0', () => {
        formControl.value = 0;
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return true if value is set', () => {
        formControl.value = 'test';
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });
});
