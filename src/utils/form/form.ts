import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';
import { FormState } from './form-state/form-state';

export type FormValidationCallback = () => FormState;

/**
 * Form Class
 */
export class Form {
    public id: string;

    /**
     *
     * @param fields fields that are in the form
     * @param validationCallbacks a list of function to call to verify the form's state
     */
    constructor(public fields: FormField<any>[], private validationCallbacks: FormValidationCallback[] = []) {
        this.id = uuid.generate();
    }

    /**
     * Number of fields that have errors
     */
    get nbFieldsThatHasError(): number {
        return this.fields.filter((field: FormField<any>) => field.hasError).length;
    }

    /**
     * return true if the form contains no field with errors
     */
    get isValid(): boolean {
        return this.nbFieldsThatHasError === 0
            &&
            !this.validationCallbacks
                .find((el: FormValidationCallback): boolean => el().hasError === true);
    }

    /**
     * reset all fields in the form without validating
     */
    reset(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.reset();
        });
    }

    /**
     * returns all the messages that must be shown in the summary
     */
    getErrorsForSummary(): string[] {
        return this.fields
            .filter((field: FormField<any>) => field.errorMessageSummary !== '')
            .map((field: FormField<any>) => field.errorMessageSummary)
            .concat(
                this.validationCallbacks
                    .map((el: FormValidationCallback) => el())
                    .filter((el: FormState) => el.hasError)
                    .map((el: FormState) => el.errorMessage)
            );
    }

    /**
     * validate all fields in the form
     */
    validateAll(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.validate();
        });
    }
}
