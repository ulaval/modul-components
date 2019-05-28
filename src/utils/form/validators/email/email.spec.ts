import { FormControl } from '../../form-control';
import { EmailValidator } from './email';

describe('email validator', () => {
    let formControl: FormControl<string>;

    beforeAll(() => {
        formControl = new FormControl<string>(
            [EmailValidator()]
        );
    });

    test('it should return true if value is empty', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.valid).toBe(true);
    });

    test('it should return false with invalid email', () => {
        formControl.value = 'test';
        formControl.validate();
        expect(formControl.valid).toBe(false);
    });

    test('it should return true with valid email', () => {
        formControl.value = 'test@test.ulaval.ca';
        formControl.validate();
        expect(formControl.valid).toBe(true);

    });
});
