import { FormControl } from "../../form-control";
import { BetweenValidator } from "../built-in-control-validators";

describe('between validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            'test',
            [BetweenValidator('test', 1, 3)]
        );
    });

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                'test',
                [BetweenValidator('test', 1, 3)]
            );
        });

        test('it should return false if value is lower than the lower bound', () => {
            formControl.value = -1;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return false if value is higher than the upper bound', () => {
            formControl.value = 4;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is between the bounds', () => {
            formControl.value = 2;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the lower bound', () => {
            formControl.value = 1;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the upper bound', () => {
            formControl.value = 3;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is 0 and between the bounds', () => {
            let formControlTest0: FormControl<number> = new FormControl<number>(
                'test',
                [BetweenValidator('test', -1, 1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();
            expect(formControlTest0.isValid).toBe(true);
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                'test',
                [BetweenValidator('test', new Date(2019, 0, 1), new Date(2019, 1, 1))]
            );
        });

        test('it should return false if value is lower than the lower bound', () => {
            formControl.value = new Date(2018, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return false if value is higher than the upper bound', () => {
            formControl.value = new Date(2020, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is between the bounds', () => {
            formControl.value = new Date(2019, 0, 2);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the lower bound', () => {
            formControl.value = new Date(2019, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the upper bound', () => {
            formControl.value = new Date(2019, 1, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });
});
