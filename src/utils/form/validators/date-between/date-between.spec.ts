import { FormControl } from '../../form-control';
import { ControlValidator } from '../control-validator';
import { DateBetweenValidator } from './date-between';

describe('Required validator', () => {

    let validator: ControlValidator;
    let formControl: FormControl<string>;

    beforeEach(() => {
        formControl = new FormControl<string>();

        validator = DateBetweenValidator('controlLabel', '2019-05-20', '2019-05-27');
    });


    it('should return true when undefined', () => {
        formControl.value = undefined;
        expect(validator.validationFunction(formControl)).toBe(true);
    });


    it('should return true when unfinished ', () => {
        formControl.value = '2001-01';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return true when invalid ', () => {
        formControl.value = '2001-01-99';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return false when is before start date', () => {
        formControl.value = '2019-05-19';
        expect(validator.validationFunction(formControl)).toBe(false);
    });


    it('should return true when date is start date', () => {
        formControl.value = '2019-05-20';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return true when date is end date', () => {
        formControl.value = '2019-05-27';
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return false when date is after end date', () => {
        formControl.value = '2019-05-28';
        expect(validator.validationFunction(formControl)).toBe(false);
    });

});
