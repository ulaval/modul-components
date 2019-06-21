import { FormControl } from '../../form-control';
import { EmailValidator } from './email';

describe('email validator', () => {
    let formControl: FormControl<string>;

    beforeEach(() => {
        formControl = new FormControl<string>(
            [EmailValidator()]
        );
    });

    it('it should be valid if value is empty', () => {

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('it should be invalid with email missing "@"', () => {
        formControl.value = 'test.com';

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('it should be invalid with email missing "."', () => {
        formControl.value = 'test@ul';

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('it should return true with valid email', () => {
        formControl.value = 'test@test.ulaval.ca';

        formControl.validate();

        expect(formControl.valid).toBe(true);

    });
});
