import { FormControl } from '../../form-control';
import { MinValidator } from './min';

describe('Min validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            [MinValidator('test', 3)]
        );
    });

    test('it should return false if value is undefined', async (done) => {
        expect(formControl.value).toBe(undefined);
        await formControl.validate();
        expect(formControl.valid).toBe(false);
        done();
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                [MinValidator('test', 3)]
            );
        });

        test('it should return false if value is 0 and min value is higher', async (done) => {
            formControl.value = 0;
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return true if value is 0 and min value is lower', async (done) => {
            const formControlTest0: FormControl<number> = new FormControl<number>(
                [MinValidator('test', -1)],
                {
                    initialValue: 0
                }
            );

            await formControlTest0.validate();

            expect(formControlTest0.valid).toBe(true);
            done();
        });

        test('it should return false if value is lower', async (done) => {
            formControl.value = 1;
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return true if value is same', async (done) => {
            formControl.value = 3;
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is higher', async (done) => {
            formControl.value = 4;
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                [MinValidator('test', new Date(2019, 0, 1))]
            );
        });

        test('it should return false if value is lower', async (done) => {
            formControl.value = new Date(2018, 0, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(false);
            done();
        });

        test('it should return true if value is same', async (done) => {
            formControl.value = new Date(2019, 0, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });

        test('it should return true if value is higher', async (done) => {
            formControl.value = new Date(2019, 1, 1);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });
    });
});
