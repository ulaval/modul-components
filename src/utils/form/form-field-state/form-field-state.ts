/**
 * Form Field State Class
 */
export class FormFieldState {
    /**
     *
     * @param hasError the field has (at least one) error
     * @param errorMessageSummary Message to show in summary
     * @param errorMessage message to show next to the field
     */
    constructor(public hasError: boolean = false, public errorMessageSummary: string = '', public errorMessage: string = '') { }
}
