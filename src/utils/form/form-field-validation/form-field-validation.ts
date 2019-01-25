/**
 * Form Field Validation Class
 */
export class FormFieldValidation {
    /**
     *
     * @param isError the validation is in error
     * @param errorMessagesSummary Message to show in summary
     * @param errorMessage message to show next to the field
     */
    constructor(public isError: boolean = false, public errorMessageSummary: string = '', public errorMessage: string = '') { }
}
