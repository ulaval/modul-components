import { FormArray } from './form-array';
import { FormControl } from './form-control';

describe('FormArray', () => {
    let formArray: FormArray;


    describe('given a FormArray with no controls', () => {
        beforeAll(() => {
            formArray = new FormArray([]);
        });

        it('should be empty of control and valid', () => {
            expect(formArray.controls.length).toBe(0);
            expect(formArray.valid).toBe(true);
            expect(formArray.hasError()).toBe(false);
            expect(formArray.waiting).toBe(false);
            expect(formArray.enabled).toBe(true);
        });

        it('when adding a control it should add the control', () => {
            formArray.addControl(new FormControl());

            expect(formArray.controls.length).toBe(1);
            expect(formArray.controls[0]).toBeDefined();
        });

    });


    describe('given an FormGroup with a control', () => {
        beforeAll(() => {
            formArray = new FormArray([new FormControl()]);
        });

        it('when removing a control it should remove the control', () => {
            formArray.removeControl(1);

            expect(formArray.controls.length).toBe(0);
        });
    });
});
