import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { CompareValidator } from './compare';

describe('compare validator', () => {
    let formGroup: FormGroup;

    beforeAll(() => {
        formGroup = new FormGroup(
            'test group',
            [
                new FormControl<string>('test 1', []),
                new FormControl<string>('test 2', []),
                new FormControl<string>('test 3', [])
            ],
            [CompareValidator(['test 1', 'test 2', 'test 3'])]
        );
    });

    test('it should return true if all controls are undefined', async (done) => {
        expect((formGroup.getControl('test 1') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 2') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 3') as FormControl<string>).value).toBe(undefined);

        await formGroup.validate();

        expect(formGroup.isValid).toBe(true);
        done();
    });


    test('it should return false if one value is different', async (done) => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';

        await formGroup.validate();

        expect(formGroup.isValid).toBe(false);
        done();
    });

    test('it should return true if all values are the same', async (done) => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 2') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 3') as FormControl<string>).value = 'test';

        await formGroup.validate();

        expect(formGroup.isValid).toBe(true);
        done();
    });
});
