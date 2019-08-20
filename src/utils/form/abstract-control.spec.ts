import { AbstractControlTest } from './abstract-control-test';
import { ControlValidatorValidationType } from './control-validator-validation-type';

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
    describe(`Witk async validators`, () => {
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
