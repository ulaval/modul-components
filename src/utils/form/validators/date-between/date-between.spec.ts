import ModulDate from '../../../modul-date/modul-date';
import { FormControl } from '../../form-control';
import { ControlValidator } from '../control-validator';
import { DateBetweenValidator } from './date-between';

describe('Required validator', () => {

    let validator: ControlValidator;
    let formControl: FormControl<string>;
    const LOWER_BOUND: ModulDate = new ModulDate('2019-05-20T12:12:12.000Z');
    const UPPER_BOUND: ModulDate = new ModulDate('2019-05-27T12:12:12.000Z');

    beforeEach(() => {
        formControl = new FormControl<string>();

        validator = DateBetweenValidator(LOWER_BOUND.toISOString(), UPPER_BOUND.toISOString());
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
        formControl.value = LOWER_BOUND.subtract(1, 'year').toISOString();
        expect(validator.validationFunction(formControl)).toBe(false);
    });


    it('should return true when date is start date', () => {
        formControl.value = LOWER_BOUND.toISOString();
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return true when date is end date', () => {
        formControl.value = UPPER_BOUND.toISOString();
        expect(validator.validationFunction(formControl)).toBe(true);
    });

    it('should return false when date is after end date', () => {
        formControl.value = UPPER_BOUND.add(1, 'year').toISOString();
        expect(validator.validationFunction(formControl)).toBe(false);
    });

});
