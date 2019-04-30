import { FormControl } from "../../form-control";
import { EmailValidator } from "./email";

describe('email validator', () => {
    let formControl: FormControl<string>;

    beforeAll(() => {
        formControl = new FormControl<string>(
            'test',
            [EmailValidator()]
        );
    });

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return false with invalid email', () => {
        formControl.value = 'test';
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true with valid email', () => {
        formControl.value = 'test@test.ulaval.ca';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });
});
