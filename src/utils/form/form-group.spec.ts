import { FormControl } from './form-control';
import { FormGroup } from './form-group';

const TEST_CONTROL_NAME: string = 'test';
const ERROR_MESSAGE: string = 'error';

describe('FormGroup', () => {
    let formGroup: FormGroup;

    describe('given a FormGroup with no control', () => {
        beforeEach(() => {
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
            beforeEach(() => {
                formGroup.addControl(TEST_CONTROL_NAME, new FormControl());
            });

            it('should add the controls properly', () => {
                expect(formGroup.controls.length).toBe(1);
                expect(formGroup.getControl(TEST_CONTROL_NAME)).toBeDefined();
            });
        });
    });

    describe('given an FormGroup with a control', () => {
        beforeEach(() => {
            formGroup = new FormGroup({
                [TEST_CONTROL_NAME]: new FormControl()
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

            expect(() => formGroup.getControl(TEST_CONTROL_NAME)).toThrow(Error);
            expect(formGroup.controls.length).toBe(0);
        });
    });
});
