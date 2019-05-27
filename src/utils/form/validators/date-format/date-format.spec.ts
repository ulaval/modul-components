import { FormControl } from '../../form-control';
import { ControlValidator } from '../control-validator';
import { DateValidator } from './date-format';

describe('Required validator', () => {

    let validator: ControlValidator;
    let formControl: FormControl<string>;

    beforeEach(() => {
        this.formControl = new FormControl<string>();

        this.validator = DateValidator('controlLabel');
    });


    it('should return true when undefined', () => {
        formControl.value = undefined;
        validator.validationFunction(formControl);
    });

});
