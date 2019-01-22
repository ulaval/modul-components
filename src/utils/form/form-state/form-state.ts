/**
 * Form State Class
 */
export class FormState {
    /**
     *
     * @param hasError the field has (at least one) error
     * @param errorMessage message to show next to the field
     */
    constructor(public hasError: boolean = false, public errorMessage: string = '') { }
}
