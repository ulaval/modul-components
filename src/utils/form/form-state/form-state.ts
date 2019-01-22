/**
 * Form State Class
 */
export class FormState {
    /**
     *
     * @param hasErrors The form has (at least one) error
     * @param errorMessage Messages list to show in summary
     */
    constructor(public hasErrors: boolean = false, public errorMessages: string[] = []) { }
}

