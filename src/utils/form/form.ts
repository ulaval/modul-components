import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';
import { FormState } from './form-state/form-state';
import { FormValidation } from './form-validation/form-validation';

export type FormValidationCallback = (formInstance: Form) => FormValidation;
export type FormFieldGroup = { [name: string]: FormField<any>; };

/**
 * Form Class
 */
export class Form {
    public id: string;
    private internalFields: FormField<any>[];
    private internalState: FormState;

    /**
     *
     * @param fieldGroup the group of field that populate the form
     * @param validationCallbacks a list of function to call to verify the form's state
     */
    constructor(private fieldGroup: FormFieldGroup, private validationCallbacks: FormValidationCallback[] = []) {
        this.id = uuid.generate();
        this.internalState = new FormState();
        this.setFields();
    }

    get fields(): FormField<any>[] {
        return this.internalFields;
    }

    /**
     * Total number of errors
     */
    get totalNbOfErrors(): number {
        return this.nbFieldsThatHasError + this.nbOfErrors;
    }

    /**
     * Number of fields that have errors
     */
    get nbFieldsThatHasError(): number {
        return this.fields.filter((field: FormField<any>) => field.hasError).length;
    }

    /**
     * Number of form errors
     */
    get nbOfErrors(): number {
        return this.internalState.errorMessages.length;
    }

    /**
     * return true if the form contains no field with errors
     */
    get isValid(): boolean {
        return this.nbFieldsThatHasError === 0 && this.nbOfErrors === 0;
    }

    /**
     * Add a field to the form
     * @param name
     * @param field
     */
    addField(name: string, field: FormField<any>): void {
        if (this.fieldGroup[name]) {
            throw Error('This field name already exist');
        }

        this.fieldGroup[name] = field;
        this.setFields();
    }

    /**
     * Remove a field to the form
     * @param name
     */
    removeField(name: string): void {
        if (!this.fieldGroup[name]) {
            throw Error('This field name does not exist');
        }

        delete this.fieldGroup[name];
        this.setFields();
    }


    /**
     * Return the formField with the coresponding name
     *
     * @param formFieldName the name of the formfield to access
     */
    get(formFieldName: string): FormField<any> {
        let formField: FormField<any> = this.fieldGroup[formFieldName];

        if (!formField) {
            throw new Error('Trying to access an non existing form field');
        }

        return this.fieldGroup[formFieldName];
    }


    /**
     * Return the name of the form field
     *
     * @param formField the formfield to find the name of
     */
    getFieldName(formField: FormField<any>): string {
        let name: string | undefined = Object
            .keys(this.fieldGroup)
            .find((key: string) => this.fieldGroup[key] === formField);

        if (!name) {
            throw new Error('Trying to access an non existing form field');
        }

        return name;
    }

    /**
     * reset all fields in the form without validating
     */
    reset(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.reset();
        });

        this.internalState = new FormState();
    }

    /**
     * returns all the messages that must be shown in the summary
     */
    getErrorsForSummary(): string[] {
        let errorsSummary: string[] = [];

        this.internalState.errorMessages.forEach((message: string) => {
            errorsSummary.push(message);
        });

        this.fields.forEach((field: FormField<any>) => {
            errorsSummary.push(field.errorMessageSummary[0]);
        });

        return errorsSummary;
    }

    focusFirstFieldWithError(): void {
        let fieldWithError: FormField<any> | undefined = this.fields.find(field => {
            return field.hasError;
        });

        if (fieldWithError) {
            fieldWithError.shouldFocus = true;
        }
    }


    /**
     * validate all fields in the form
     */
    validateAll(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.validate(true);
        });

        this.internalState = new FormState();
        this.validationCallbacks.forEach((validationCallback: FormValidationCallback) => {
            this.changeState(validationCallback(this));
        });
    }

    private changeState(formValidation: FormValidation): void {
        if (!formValidation.hasError) {
            return;
        }

        this.internalState.hasErrors = true;
        this.internalState.errorMessages = this.internalState.errorMessages.concat(formValidation.errorMessage);
    }

    private setFields(): void {
        this.internalFields = Object.keys(this.fieldGroup)
            .map((name: string): FormField<any> => this.fieldGroup[name]);
    }
}
