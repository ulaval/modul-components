import { FormControl } from '../../form-control';
import { EmailValidator } from './email';

describe('email validator', () => {
    let formControl: FormControl<string>;

    beforeAll(() => {
        formControl = new FormControl<string>(
            [EmailValidator()]
        );
    });

    test('it should return false if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return false with invalid email', async (done) => {
        formControl.value = 'test';
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    test('it should return true with valid email', async (done) => {
        formControl.value = 'test@test.ulaval.ca';
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });
});
