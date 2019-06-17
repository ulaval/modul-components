import { FormControl } from '../../form-control';
import { MinValidator } from './min';

describe('Min validator', () => {
    let formControl: FormControl<any>;

    describe('type "any" FormControl', () => {
        it('it should return true if value is undefined', async (done) => {
            formControl = new FormControl<any>(
                [MinValidator(3)]
            );
            expect(formControl.value).toBe(undefined);
            await formControl.validate();
            expect(formControl.valid).toBe(true);
            done();
        });
    });

    describe('numeric FormControl', () => {
        const MIN_VALUE: number = 3;

        beforeEach(() => {
            formControl = new FormControl<number>(
                [MinValidator(MIN_VALUE)]
            );
        });

        it('it should return false if value is 0 and min value is higher', () => {
            formControl.value = 0;

            formControl.validate();

            expect(formControl.valid).toBe(false);
        });

        it('it should return true if value is 0 and min value is lower', () => {
            const formControlTest0: FormControl<number> = new FormControl<number>(
                [MinValidator(-1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();

            expect(formControlTest0.valid).toBe(true);
        });

        it('it should return false if value is lower', () => {
            formControl.value = MIN_VALUE - 1;

            formControl.validate();

            expect(formControl.valid).toBe(false);
        });

        it('it should return true if value is same', () => {
            formControl.value = MIN_VALUE;

            formControl.validate();

            expect(formControl.valid).toBe(true);

        });

        it('it should return true if value is higher', () => {
            formControl.value = MIN_VALUE + 1;

            formControl.validate();

            expect(formControl.valid).toBe(true);
        });
    });
});
