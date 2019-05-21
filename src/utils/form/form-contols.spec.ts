import { ControlValidatorValidationType } from './control-validator-validation-type';
import { FormControl } from './form-control';

const ALWAYS_FALSE: string = 'Always false';

describe('FromControl', () => {
    let formControl: FormControl<any>;


    describe('given a FormControl with no validation', () => {

        beforeAll(() => {
            formControl = new FormControl<string>([],
                {
                    initialValue: 'foo'
                });
        });

        it('should be empty of control and valid', () => {
            expect(formControl.valid).toBe(true);
            expect(formControl.hasError()).toBe(false);
            expect(formControl.waiting).toBe(false);
            expect(formControl.enabled).toBe(true);
            expect(formControl.readonly).toBe(false);
            expect(formControl.pristine).toBe(true);
            expect(formControl.touched).toBe(false);
            expect(formControl.value).toBe('foo');
        });


        describe('when edited', () => {
            beforeAll(() => {
                formControl.initEdition();
                formControl.value = 'test';
                formControl.endEdition();
            });


            it('should run validation and set flag', () => {
                expect(formControl.valid).toBe(true);
                expect(formControl.hasError()).toBe(false);
                expect(formControl.waiting).toBe(false);
                expect(formControl.pristine).toBe(false);
                expect(formControl.touched).toBe(true);
                expect(formControl.value).toBe('test');
            });


            it('should reset to inital value on reset', () => {
                formControl.reset();

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

    describe('given a FormControl with a always false OnGoing validation', () => {

        beforeAll(() => {
            formControl = new FormControl<string>(
                [{
                    key: ALWAYS_FALSE,
                    validationFunction: (control: FormControl<string>) => {
                        return false;
                    },
                    error: {
                        message: ALWAYS_FALSE
                    },
                    validationType: ControlValidatorValidationType.OnGoing
                }]
            );
        });

        it('should be invalid and no error', async () => {
            expect(formControl.valid).toBe(false);
            expect(formControl.hasError()).toBe(false);
            expect(formControl.errorMessage).toBe('');
            formControl.validate();
            expect(formControl.hasError()).toBe(true);
        });

        describe('when edited', () => {
            beforeAll(() => {
                formControl.initEdition();
                formControl.value = 'test';
                formControl.endEdition();
            });

            it('should be invalid and has error', () => {
                expect(formControl.valid).toBe(false);
                expect(formControl.hasError()).toBe(true);
                expect(formControl.errorMessage).toBe(ALWAYS_FALSE);
            });

            it('should reset message inital value on reset', () => {

                formControl.reset();

                expect(formControl.valid).toBe(false);
                expect(formControl.hasError()).toBe(false);
                expect(formControl.errorMessage).toBe('');
            });

            it('should be valid when readonly', () => {
                formControl.readonly = true;
                expect(formControl.valid).toBe(true);
                expect(formControl.hasError()).toBe(false);
                expect(formControl.errorMessage).toBe('');
            });


            it('should be valid when disabled', () => {
                formControl.enabled = false;
                expect(formControl.valid).toBe(true);
                expect(formControl.hasError()).toBe(false);
                expect(formControl.errorMessage).toBe('');
            });

        });
    });
});
