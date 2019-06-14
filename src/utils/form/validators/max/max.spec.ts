import { FormControl } from '../../form-control';
import { MaxValidator } from './max';

describe('Max validator', () => {
    let formControl: FormControl<any>;

    describe('"any" type form ', () => {
        it('it should return true if value is undefined', () => {
            formControl = new FormControl<any>(
                [MaxValidator(3)]
            );

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });
    });

    describe('number value', () => {

        const MAX_VALUE: number = 3;

        beforeEach(() => {
            formControl = new FormControl<number>(
                [MaxValidator(MAX_VALUE)]
            );
        });

        it('it should return true if value is 0 and max value is higher', () => {
            formControl.value = 0;
            formControl.validate();
            expect(formControl.valid).toBe(true);
        });

        it('it should return false if value is 0 and max value is lower', () => {
            formControl = new FormControl<number>(
                [MaxValidator(-1)],
                {
                    initialValue: 0
                }
            );

            formControl.validate();

            expect(formControl.valid).toBe(false);
        });

        it('it should return true if value is lower than max value', () => {
            formControl.value = MAX_VALUE - 1;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });

        it('it should return true if value is same', () => {
            formControl.value = MAX_VALUE;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });

        it('it should return false if value is higher', () => {
            formControl.value = MAX_VALUE + 1;

            formControl.validate();

            expect(formControl.valid).toBe(false);
        });
    });
});
