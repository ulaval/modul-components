/**
 * Form validation class
 */
export class FormValidation {
    /**
     *
     * @param hasError The validation has an error
     * @param errorMessage Message to show in summary
     */
    constructor(public hasError: boolean = false, public errorMessage: string = '') { }
}
