import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';

/**
 * Form Class
 */
export class Form {
    public id: string;

    /**
     *
     * @param fields fields that are in the form
     */
    constructor(public fields: FormField<any>[]) {
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
        return this.nbFieldsThatHasError === 0;
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
        return this.fields.filter((field: FormField<any>) => field.errorMessageSummary !== '').map((field: FormField<any>) => field.errorMessageSummary);
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
