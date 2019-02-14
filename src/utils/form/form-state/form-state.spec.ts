import { FormState } from './form-state';

describe(`FormState`, () => {
    it(`Default parameters are setup`, () => {
        let formState: FormState = new FormState();
        expect(formState.hasErrors).toBeFalsy();
        expect(formState.errorMessages.length).toBe(0);
    });
});
