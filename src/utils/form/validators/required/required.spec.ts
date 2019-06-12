import { FormControl } from '../../form-control';
import { RequiredValidator } from './required';

describe('Required validator', () => {
    let formControl: FormControl<any>;

    beforeEach(() => {
        formControl = new FormControl<any>(
            [RequiredValidator()]
        );
    });

    test('if value is undefined, it should be invalid', () => {

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    test('if value is empty array, it should be invalid', () => {
        formControl.value = [];

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    test('is value is empty string, it should be invalid', () => {
        formControl.value = '';

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    test('if value is 0, it should be valid', () => {
        formControl.value = 0;

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('if value is set, it should be valid', () => {
        formControl.value = 'test';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });
});
