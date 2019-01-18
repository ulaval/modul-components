import { FormFieldState } from './form-field-state';

describe(`FormFieldState`, () => {
    it(`Default parameters are setup`, () => {
        let etatChampFormulaire: FormFieldState = new FormFieldState();
        expect(etatChampFormulaire.hasError).toBeFalsy();
        expect(etatChampFormulaire.errorMessageSummary).toBe('');
        expect(etatChampFormulaire.errorMessage).toBe('');
    });
});
