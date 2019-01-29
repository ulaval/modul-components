import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';
import { FormState } from './form-state/form-state';
import { FormValidation } from './form-validation/form-validation';

export type FormValidationCallback = () => FormValidation;

/**
 * Form Class
 */
export class Form {
    public id: string;

    private internalState: FormState;

    /**
     *
     * @param fields fields that are in the form
     * @param validationCallbacks a list of function to call to verify the form's state
     */
    constructor(public fields: FormField<any>[], private validationCallbacks: FormValidationCallback[] = []) {
        this.id = uuid.generate();
        this.internalState = new FormState();
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
        return this.fields
            .filter((field: FormField<any>) => field.errorMessageSummary !== '')
            .map((field: FormField<any>) => field.errorMessageSummary)
            .concat(this.internalState.errorMessages);
    }


    /**
     * validate all fields in the form
     */
    validateAll(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.validate();
        });

        this.internalState = new FormState();
        this.validationCallbacks.forEach((validationCallback: FormValidationCallback) => {
            this.changeState(validationCallback());
        });
    }

    private changeState(formValidation: FormValidation): void {
        if (!formValidation.hasError) {
            return;
        }

        this.internalState.hasErrors = true;
        this.internalState.errorMessages.push(formValidation.errorMessage);
    }
}
