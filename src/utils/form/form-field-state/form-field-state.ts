/**
 * Form Field State Class
 */
export class FormFieldState {
    /**
     *
     * @param hasError the field has (at least one) error
     * @param errorMessagesSummary Messages to show in summary
     * @param errorMessage messages to show next to the field
     */
    constructor(public hasError: boolean = false, public errorMessagesSummary: string[] = [], public errorMessages: string[] = []) { }
}
