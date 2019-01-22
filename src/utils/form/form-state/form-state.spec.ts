import { FormState } from './form-state';

describe(`FormState`, () => {
    it(`Default parameters are setup`, () => {
        let etatFormulaire: FormState = new FormState();
        expect(etatFormulaire.hasError).toBeFalsy();
        expect(etatFormulaire.errorMessage).toBe('');
    });
});
