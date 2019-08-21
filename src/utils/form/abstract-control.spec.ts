import { AbstractControl } from './abstract-control';
import { ControlError } from './control-error';
import { ControlValidatorValidationType } from './control-validator-validation-type';
import { ControlValidator } from './validators/control-validator';

export class AbstractControlTest extends AbstractControl {
    constructor(private _controls: {
        [name: string]: AbstractControl;
    }, public readonly validators: ControlValidator[] = []) {
        super(validators);
    }
    public value: any;
    public valid: boolean;
    public enabled: boolean;
    public waiting: boolean;
    public readonly: boolean;
    public touched: boolean;
    public errors: ControlError[];
    public errorsDeep: ControlError[];
    public get controls(): AbstractControl[] {
        return Object.values(this._controls);
    }
    public getControl<T = any>(name: string): AbstractControl<T> {
        throw new Error('Method not implemented.');
    }
    public submit(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

describe(`Given abstract-control implementation`, () => {
    describe(`Without async validators`, () => {
        const mockValidationFunction: jest.Mock = jest.fn();
        const control: AbstractControlTest = new AbstractControlTest({}, [{
            key: 'syncValidator',
            validationFunction: mockValidationFunction,
            async: false,
            error: {
                message: 'invalide'
            },
            validationType: ControlValidatorValidationType.AtExit
        }]);
        beforeEach(() => {
            mockValidationFunction.mockReset();
        });
        describe(`When validating`, () => {
            it(`Should call validation function`, () => {
                control.validate();

                expect(mockValidationFunction).toBeCalledTimes(1);
            });
        });
        describe(`When validating async`, () => {
            it(`Should not call validation function`, () => {
                control.validateAsync();

                expect(mockValidationFunction).not.toBeCalled();
            });
        });
    });
    describe(`With async validators`, () => {
        const mockValidationFunction: jest.Mock = jest.fn(() => Promise.resolve(true));
        const control: AbstractControlTest = new AbstractControlTest({}, [{
            key: 'asyncValidator',
            validationFunction: mockValidationFunction,
            async: true,
            error: {
                message: 'invalide'
            },
            validationType: ControlValidatorValidationType.OnGoing
        }]);
        beforeEach(() => {
            mockValidationFunction.mockReset();
        });
        describe(`When validating`, () => {
            it(`Should not call validation function`, () => {
                control.validate();

                expect(mockValidationFunction).not.toBeCalled();
            });
        });
        describe(`When validating async`, () => {
            it(`Should call validation function`, () => {
                control.validateAsync();

                expect(mockValidationFunction).toBeCalledTimes(1);
            });
        });
    });
});
