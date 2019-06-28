import { FormControl } from '../../form-control';
import { RequiredValidator } from './required';

describe('Required validator', () => {
    let formControl: FormControl<any>;

    beforeEach(() => {
        formControl = new FormControl<any>(
            [RequiredValidator()]
        );
    });

    it('if value is undefined, it should be invalid', () => {

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('if value is empty array, it should be invalid', () => {
        formControl.value = [];

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('is value is empty string, it should be invalid', () => {
        formControl.value = '';

        formControl.validate();

        expect(formControl.valid).toBe(false);
    });

    it('if value is 0, it should be valid', () => {
        formControl.value = 0;

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });

    it('if value is set, it should be valid', () => {
        formControl.value = 'test';

        formControl.validate();

        expect(formControl.valid).toBe(true);
    });
});
