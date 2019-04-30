import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";
import { CompareValidator } from "../built-in-control-validators";

describe('compare validator', () => {
    let formGroup: FormGroup;

    beforeAll(() => {
        formGroup = new FormGroup(
            'test group',
            [CompareValidator(['test 1', 'test 2', 'test 3'])],
            [
                new FormControl<string>('test 1', []),
                new FormControl<string>('test 2', []),
                new FormControl<string>('test 3', [])
            ]
        );
    });

    test('it should return true if all controls are undefined', () => {
        expect((formGroup.getControl('test 1') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 2') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 3') as FormControl<string>).value).toBe(undefined);

        formGroup.validate();

        expect(formGroup.isValid).toBe(true);
    });

    test('it should return false if one value is different', () => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.isValid).toBe(false);
    });

    test('it should return true if all values are the same', () => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 2') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 3') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.isValid).toBe(true);
    });
});
