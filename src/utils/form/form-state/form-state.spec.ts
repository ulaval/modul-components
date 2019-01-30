import { FormState } from './form-state';

describe(`FormState`, () => {
    it(`Default parameters are setup`, () => {
        let etatFormulaire: FormState = new FormState();
        expect(etatFormulaire.hasErrors).toBeFalsy();
        expect(etatFormulaire.errorMessages.length).toBe(0);
    });
});
