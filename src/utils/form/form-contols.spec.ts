import { FormControl } from './form-control';

describe('FromControl', () => {
    let formControl: FormControl<any>;


    describe('given a FormControl with no validation', () => {
        beforeAll(() => {
            formControl = new FormControl<string>();
        });

        it('should be empty of control and valid', () => {
            expect(formControl.valid).toBe(true);
            expect(formControl.hasError()).toBe(false);
            expect(formControl.waiting).toBe(false);
            expect(formControl.enabled).toBe(true);
        });
    });
});
