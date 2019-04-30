import { FormControl } from "../../form-control";
import { MinValidator } from "./min-validator";

describe('Min validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            'test',
            [MinValidator('test', 3)]
        );
    })

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                'test',
                [MinValidator('test', 3)]
            );
        });

        test('it should return false if value is 0 and min value is higher', () => {
            formControl.value = 0;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is 0 and min value is lower', () => {
            const formControlTest0: FormControl<number> = new FormControl<number>(
                'test',
                [MinValidator('test', -1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();

            expect(formControlTest0.isValid).toBe(true);
        });

        test('it should return false if value is lower', () => {
            formControl.value = 1;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is same', () => {
            formControl.value = 3;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is higher', () => {
            formControl.value = 4;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                'test',
                [MinValidator('test', new Date(2019, 0, 1))]
            );
        });

        test('it should return false if value is lower', () => {
            formControl.value = new Date(2018, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is same', () => {
            formControl.value = new Date(2019, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is higher', () => {
            formControl.value = new Date(2019, 1, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });
});
