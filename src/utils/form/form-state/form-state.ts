/**
 * Form State Class
 */
export class FormState {
    /**
     *
     * @param hasError The form has (at least one) error
     * @param errorMessage Message to show in summary
     */
    constructor(public hasError: boolean = false, public errorMessage: string = '') { }
}
