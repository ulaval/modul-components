import { FormControl } from '../../form-control';
import { MaxLengthValidator } from './max-length';

describe('Max length validator', () => {
    const MAX_LENGTH: number = 3;
    let formControl: FormControl<any>;

    beforeEach(() => {
        formControl = new FormControl<any>(
            [MaxLengthValidator(MAX_LENGTH)]
        );
    });

    it('it should return true if value is undefined', () => {
        expect(formControl.value).toBe(undefined);

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('it should return true if value is empty string', () => {
        formControl.value = '';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('it should return false if is longer', () => {
        formControl.value = '1234';

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('it should return true is same', () => {
        formControl.value = '123';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('it should return true if number length is shorter', () => {
        formControl.value = 12;

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('it should return false if number length is longer', () => {
        formControl.value = 1234;

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('it should return false if array length is longer', () => {
        formControl.value = [12, 2, 33, 4];

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('it should return true if array length is shorter', () => {
        formControl.value = ['12', '222'];

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });
});
