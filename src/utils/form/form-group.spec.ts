import { FormControl } from './form-control';
import { FormGroup } from './form-group';

const TEST: string = 'test';

describe('FormGroup', () => {
    let formGroup: FormGroup;

    describe('given a FormGroup with no control', () => {

        beforeAll(() => {
            formGroup = new FormGroup({});
        });

        it('should be empty of control and valid', () => {
            expect(formGroup.controls.length).toBe(0);
            expect(formGroup.valid).toBe(true);
            expect(formGroup.hasError()).toBe(false);
            expect(formGroup.waiting).toBe(false);
            expect(formGroup.enabled).toBe(true);
        });

        describe('when adding a required control', () => {

            beforeAll(() => {
                formGroup.addControl(TEST, new FormControl());
            });

            it('should add the controls properly', () => {
                expect(formGroup.controls.length).toBe(1);
                expect(formGroup.getControl('test')).toBeDefined();
            });
        });

    });
    describe('given an FormGroup with a control', () => {
        beforeAll(() => {
            formGroup = new FormGroup({
                'test': new FormControl()
            });
        });

        it('should have the control and be valid', () => {
            expect(formGroup.controls.length).toBe(1);
            expect(formGroup.valid).toBe(true);
            expect(formGroup.hasError()).toBe(false);
            expect(formGroup.waiting).toBe(false);
            expect(formGroup.enabled).toBe(true);
        });

        it('when removing it should removing the control properly', () => {
            formGroup.removeControl('test');

            expect(() => formGroup.getControl('test')).toThrow();

            expect(formGroup.controls.length).toBe(0);
        });

    });

});

