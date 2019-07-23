import { FormControl } from '../../form-control';
import { ControlValidator } from '../control-validator';
import { DateFormatValidator } from './date-format';

describe('Required validator', () => {

    let validator: ControlValidator;
    let formControl: FormControl<string>;

    beforeEach(() => {
        formControl = new FormControl<string>();

        validator = DateFormatValidator();
    });


    it('should return true when undefined', () => {
        formControl.value = undefined;
        expect(validator.validationFunction(formControl)).toBe(true);
    });


    it('should return false when unfinished ', () => {
        formControl.value = '2001-01';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return false when invalid ', () => {
        formControl.value = '2001-01-99';
        expect(validator.validationFunction(formControl)).toBe(false);
    });

    it('should return true when valid ', () => {
        formControl.value = '2001-01-01';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

});
