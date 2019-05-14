import { FormControl } from './form-control';

describe('FromControl', () => {
    let formControl: FormControl<any>;


    describe('given a FormControl with no validation', () => {

        it('should be empty of control and valid', () => {
            formControl = new FormControl<string>();

            expect(formControl.valid).toBe(true);
            expect(formControl.hasError()).toBe(false);
            expect(formControl.waiting).toBe(false);
            expect(formControl.enabled).toBe(true);
            expect(formControl.readonly).toBe(false);
            expect(formControl.pristine).toBe(true);
            expect(formControl.touched).toBe(false);
            expect(formControl.value).toBeUndefined();
        });

        it('initial value should be set', () => {
            formControl = new FormControl<string>([],
                {
                    initialValue: 'foo'
                });

            expect(formControl.valid).toBe(true);
            expect(formControl.hasError()).toBe(false);
            expect(formControl.waiting).toBe(false);
            expect(formControl.enabled).toBe(true);
            expect(formControl.readonly).toBe(false);
            expect(formControl.pristine).toBe(true);
            expect(formControl.touched).toBe(false);
            expect(formControl.value).toBe('foo');
        });
    });
});
