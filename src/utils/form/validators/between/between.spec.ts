import { FormControl } from '../../form-control';
import { BetweenValidator } from './between';

describe('between validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            [BetweenValidator('test', 1, 3)]
        );
    });

    test('it should return false if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(true);
        done();
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                [BetweenValidator('test', 1, 3)]
            );
        });

        test('it should return false if value is lower than the lower bound', async (done) => {
            formControl.value = -1;
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return false if value is higher than the upper bound', async (done) => {
            formControl.value = 4;
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return true if value is between the bounds', async (done) => {
            formControl.value = 2;
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is equal to the lower bound', async (done) => {
            formControl.value = 1;
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is equal to the upper bound', async (done) => {
            formControl.value = 3;
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is 0 and between the bounds', async (done) => {
            let formControlTest0: FormControl<number> = new FormControl<number>(
                [BetweenValidator('test', -1, 1)],
                {
                    initialValue: 0
                }
            );

            await formControlTest0.validate();
            expect(formControlTest0.valid).toBe(true);
            done();
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                [BetweenValidator('test', new Date(2019, 0, 1), new Date(2019, 1, 1))]
            );
        });

        test('it should return false if value is lower than the lower bound', async (done) => {
            formControl.value = new Date(2018, 0, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return false if value is higher than the upper bound', async (done) => {
            formControl.value = new Date(2020, 0, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return true if value is between the bounds', async (done) => {
            formControl.value = new Date(2019, 0, 2);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is equal to the lower bound', async (done) => {
            formControl.value = new Date(2019, 0, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is equal to the upper bound', async (done) => {
            formControl.value = new Date(2019, 1, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });
    });
});
