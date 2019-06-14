import { FormControl } from '../../form-control';
import { BetweenValidator } from './between';

describe('between validator', () => {
    let formControl: FormControl<any>;

    describe('any type', () => {
        describe('Given an undefined value', () => {
            it('it should be valid', () => {
                formControl = new FormControl<any>(
                    [BetweenValidator(1, 3)]
                );

                formControl.validate();

                expect(formControl.valid).toBe(true);
            });
        });

    });

    describe('number value', () => {
        const LOWER_BOUND: number = 1;
        const UPPER_BOUND: number = 3;

        beforeEach(() => {
            formControl = new FormControl<number>(
                [BetweenValidator(LOWER_BOUND, UPPER_BOUND)]
            );
        });

        describe('Given a value lower than the lower bound', () => {
            it('it should be invalid', () => {
                formControl.value = LOWER_BOUND - 1;

                formControl.validate();

                expect(formControl.valid).toBe(false);
            });
        });

        describe('Given a value higher than the upper bound', () => {
            it('it should be invalid', () => {
                formControl.value = UPPER_BOUND + 1;

                formControl.validate();

                expect(formControl.valid).toBe(false);
            });
        });

        describe('Given a value between the bounds', () => {
            it('it should be valid', () => {
                formControl.value = UPPER_BOUND - 1;

                formControl.validate();

                expect(formControl.valid).toBe(true);
            });
        });

        describe('Given a value equal to the lower bound', () => {
            it('it should be valid', () => {
                formControl.value = LOWER_BOUND;

                formControl.validate();

                expect(formControl.valid).toBe(true);
            });
        });

        describe('Given a value equal to the upper bound', () => {
            it('it should be valid', () => {
                formControl.value = UPPER_BOUND;

                formControl.validate();

                expect(formControl.valid).toBe(true);
            });
        });

        describe('Given a value equal to 0 and betweent the bounds the bounds', () => {
            it('it should be valid', () => {
                formControl = new FormControl<number>(
                    [BetweenValidator(-1, 1)],
                    { initialValue: 0 }
                );

                formControl.validate();

                expect(formControl.valid).toBe(true);
            });
        });
    });

    describe('date value', () => {
        const LOWER_BOUND: Date = new Date(2019, 0, 1);
        const UPPER_BOUND: Date = new Date(2019, 1, 1);

        beforeEach(() => {
            formControl = new FormControl<Date>(
                [BetweenValidator(LOWER_BOUND.valueOf(), UPPER_BOUND.valueOf())]
            );
        });

        it('if value is lower than the lower bound, it should be invalid', () => {
            formControl.value = LOWER_BOUND.valueOf() - 1;

            formControl.validate();

            expect(formControl.valid).toBe(false);
        });

        it('if value is higher than the upper bound, it should be invalid', () => {
            formControl.value = UPPER_BOUND.valueOf() + 1;

            formControl.validate();

            expect(formControl.valid).toBe(false);

        });

        it('if value is between the bounds, it should be valid', () => {
            formControl.value = UPPER_BOUND.valueOf() - 1;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });

        it('if value is equal to the lower bound, it should be valid', () => {
            formControl.value = LOWER_BOUND;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });

        it('if value is equal to the upper bound, it should be valid', () => {
            formControl.value = UPPER_BOUND;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });
    });
});
