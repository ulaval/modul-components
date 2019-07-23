import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { CompareValidator } from './compare';

describe('compare validator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
        formGroup = new FormGroup(
            {
                'test1': new FormControl<string>([]),
                'test2': new FormControl<string>([]),
                'test3': new FormControl<string>([])
            },
            [CompareValidator(['test1', 'test2', 'test3'])]
        );
    });

    it('it should return true if all controls are undefined', () => {
        expect((formGroup.getControl('test1') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test2') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test3') as FormControl<string>).value).toBe(undefined);

        formGroup.validate();

        expect(formGroup.valid).toBe(true);

    });

    it('it should return false if one value is different', () => {
        (formGroup.getControl('test1') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.valid).toBe(false);

    });

    it('it should return true if all values are the same', () => {
        (formGroup.getControl('test1') as FormControl<string>).value = 'test';
        (formGroup.getControl('test2') as FormControl<string>).value = 'test';
        (formGroup.getControl('test3') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.valid).toBe(true);
    });
});
