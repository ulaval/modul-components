import { FormControl } from '../../form-control';
import { MinLengthValidator } from './min-length';

describe('Min length validator', () => {
    const MIN_LENGTH: number = 3;

    let formControl: FormControl<any>;

    beforeEach(() => {
        formControl = new FormControl<any>(
            [MinLengthValidator(MIN_LENGTH)]
        );
    });

    test('if value is undefined, it should be valid', () => {

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('if value is empty string, it should be valid', () => {
        formControl.value = '';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('if is longer, it should be valid', () => {
        formControl.value = '1234';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('it should return true is same', () => {
        formControl.value = '123';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('if number length is longer, it should be valid', () => {
        formControl.value = 1234;

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    test('if array length is smaller, it should be invalid', () => {
        formControl.value = [1];

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    test('if array length is longer, it should be valid', () => {
        formControl.value = [1, 2, 3, 4];

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });
});
