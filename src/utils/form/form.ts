import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';

export type FormFieldGroup = { [name: string]: FormField<any>; };

/**
 * Form Class
 */
export class Form {
    public id: string;

    /**
     *
     * @param fieldGroup the group of field that populate the form
     */
    constructor(private fieldGroup: FormFieldGroup) {
        this.id = uuid.generate();
    }

    /**
     * return the form fields
     */
    get fields(): FormField<any>[] {
        return Object.keys(this.fieldGroup).map(key => this.fieldGroup[key]);
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
     * Return the formField with the coresponding name
     *
     * @param formFieldName the name of the formfield to access
     */
    get(formFieldName: string): FormField<any> | undefined {
        return this.fieldGroup[formFieldName];
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
