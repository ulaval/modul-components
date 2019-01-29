/**
 * Form Field Validation Class
 */
export class FormFieldValidation {
    /**
     *
     * @param isError the validation is in error
     * @param errorMessagesSummary Messages to show in summary
     * @param errorMessages messages to show next to the field
     */
    constructor(public isError: boolean = false, public errorMessagesSummary: string[] = [], public errorMessages: string[] = []) { }
}
